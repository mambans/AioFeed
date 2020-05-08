import { useEffect } from "react";

export default ({ TwitchPlayer, type, setShowUIControlls }) => {
  useEffect(() => {
    const fullscreenKeyEvent = (e) => {
      if (e.key === "f" || e.key === "F") {
        toggleFullscreen2();
      }
    };

    // const toggleFullscreen = () => {
    //   const el = document.getElementsByTagName("iframe")[0];
    //   if (document.fullscreenElement) {
    //     document.exitFullscreen();
    //   } else {
    //     if (el.requestFullScreen) {
    //       el.requestFullScreen();
    //     } else if (el.mozRequestFullScreen) {
    //       el.mozRequestFullScreen();
    //     } else if (el.webkitRequestFullScreen) {
    //       el.webkitRequestFullScreen();
    //     }
    //   }
    // };

    const hideTwitchUIShowCustomUI = () => {
      if (TwitchPlayer) {
        setShowUIControlls(true);
        TwitchPlayer.showPlayerControls(false);
      }
    };

    const toggleFullscreen2 = () => {
      const isFullScreen = TwitchPlayer.getFullscreen();
      TwitchPlayer.setFullscreen(!isFullScreen);
      TwitchPlayer.showPlayerControls(!isFullScreen);

      if (TwitchPlayer.getFullscreen() && document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      } else if (TwitchPlayer._bridge._iframe.requestFullScreen) {
        TwitchPlayer._bridge._iframe.requestFullScreen();
      } else if (TwitchPlayer._bridge._iframe.mozRequestFullScreen) {
        TwitchPlayer._bridge._iframe.mozRequestFullScreen();
      } else if (TwitchPlayer._bridge._iframe.webkitRequestFullScreen) {
        TwitchPlayer._bridge._iframe.webkitRequestFullScreen();
      }
    };

    const twitchPlayerEventListeners = () => {
      if (type === "live") TwitchPlayer.showPlayerControls(false);
      document.body.addEventListener("keydown", fullscreenKeyEvent);
      // document.body.addEventListener("dblclick", toggleFullscreen);
    };

    TwitchPlayer.addEventListener(window.Twitch.Player.READY, twitchPlayerEventListeners);
    TwitchPlayer.addEventListener(window.Twitch.Player.PLAYING, hideTwitchUIShowCustomUI);

    return () => {
      document.body.removeEventListener("keydown", fullscreenKeyEvent);
      TwitchPlayer.removeEventListener(window.Twitch.Player.READY, twitchPlayerEventListeners);
      TwitchPlayer.removeEventListener(window.Twitch.Player.PLAYING, hideTwitchUIShowCustomUI);
      // document.body.removeEventListener("dblclick", toggleFullscreen);
    };
  }, [TwitchPlayer, type, setShowUIControlls]);

  return null;
};
