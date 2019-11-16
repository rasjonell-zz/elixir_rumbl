import Player from "./player";

export default {
  scheduleTimer: null,

  init(socket, element) {
    if (!element) return;

    const videoId = element.getAttribute("data-id");
    const playerId = element.getAttribute("data-player-id");

    socket.connect();

    Player.init(element.id, playerId, () => this.onReady(videoId, socket));
  },

  onReady(videoId, socket) {
    const msgInput = document.getElementById("msg-input");
    const postButton = document.getElementById("msg-submit");
    const msgContainer = document.getElementById("msg-container");

    let lastSeenId = 0;

    const vidChannel = socket.channel(`videos:${videoId}`, () => ({
      last_seen_id: lastSeenId
    }));

    postButton.addEventListener("click", e => {
      const payload = { body: msgInput.value, at: Player.getCurrentTime() };

      vidChannel.push("new_annotation", payload).receive("error", console.log);

      msgInput.value = "";
    });

    vidChannel.on("new_annotation", resp => {
      lastSeenId = resp.id;
      this.renderAnnotation(msgContainer, resp);
    });

    msgContainer.addEventListener("click", e => {
      e.preventDefault();

      const seconds =
        e.target.getAttribute("data-seek") ||
        e.target.parentNode.getAttribute("data-seek");

      if (!seconds) return;

      Player.seekTo(seconds);
    });

    vidChannel
      .join()
      .receive("ok", ({ annotations }) => {
        const ids = annotations.map(annotation => annotation.id);
        if (ids.length > 0) lastSeenId = Math.max(ids);

        this.scheduleMessages(msgContainer, annotations);
      })
      .receive("error", reason => console.log("join failed", reason));
  },

  scheduleMessages(msgContainer, annotations) {
    clearTimeout(this.scheduleTimer);

    this.scheduleTimer = setTimeout(() => {
      const currentTime = Player.getCurrentTime();
      const remaining = this.renderAtTime(
        annotations,
        currentTime,
        msgContainer
      );

      this.scheduleMessages(msgContainer, remaining);
    }, 1000);
  },

  renderAtTime(annotations, currentTime, msgContainer) {
    return annotations.filter(annotation => {
      if (annotation.at > currentTime) return true;

      this.renderAnnotation(msgContainer, annotation);
      return false;
    });
  },

  renderAnnotation(msgContainer, { user, body, at }) {
    const template = document.createElement("div");
    const [escUsername, escBody, escAt] = [user.username, body, at].map(
      this.escape
    );
    const formattedTime = this.formatTime(at);

    template.innerHTML = `
      <a href="#" data-seek="${escAt}">
        [${formattedTime}]
        <strong>${escUsername}</strong>: ${escBody}
      </a>
    `;

    msgContainer.appendChild(template);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  },

  escape(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  },

  formatTime(at) {
    const date = new Date(null);
    date.setSeconds(at / 1000);
    return date.toISOString().substr(14, 5);
  }
};
