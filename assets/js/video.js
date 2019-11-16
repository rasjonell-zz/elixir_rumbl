import Player from "./player";

export default {
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

    const vidChannel = socket.channel(`videos:${videoId}`);

    postButton.addEventListener("click", e => {
      const payload = { body: msgInput.value, at: Player.getCurrentTime() };

      vidChannel.push("new_annotation", payload).receive("error", console.log);

      msgInput.value = "";
    });

    vidChannel.on("new_annotation", resp =>
      this.renderAnnotation(msgContainer, resp)
    );

    vidChannel
      .join()
      .receive("ok", resp => console.log("joined the video channel", resp))
      .receive("error", reason => console.log("join failed", reason));
  },

  escape(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  },

  renderAnnotation(msgContainer, { user, body, at }) {
    const template = document.createElement("div");
    const [escUsername, escBody, escAt] = [user.username, body, at].map(
      this.escape
    );

    template.innerHTML = `
      <a href="#" data-seek="${escAt}">
        <strong>${escUsername}</strong>: ${escBody}
      </a>
    `;

    msgContainer.appendChild(template);

    msgContainer.scrollTop = msgContainer.scrollHeight;
  }
};
