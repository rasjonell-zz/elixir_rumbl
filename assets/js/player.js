export default {
  player: null,

  init(domId, playerId, onReady) {
    window.onYouTubeIframeAPIReady = () =>
      this.onIframeReady(domId, playerId, onReady);

    const youtubeScript = document.createElement("script");
    youtubeScript.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(youtubeScript);
  },

  onIframeReady(domId, playerId, onReady) {
    this.player = new YT.Player(domId, {
      width: "420",
      height: "360",
      videoId: playerId,
      events: {
        onReady: event => onReady(event),
        onStateChange: this.onPlayerStateChange
      }
    });
  },

  onPlayerStateChange(_event) {},

  getCurrentTime() {
    return Math.floor(this.player.getCurrentTime() * 1000);
  },

  seekTo(millsec) {
    return this.player.seekTo(millsec / 1000);
  }
};
