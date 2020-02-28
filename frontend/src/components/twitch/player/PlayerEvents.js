import { useEffect } from "react";

export default ({
  volumeEventOverlayRef,
  setVolumeText,
  setVolumeMuted,
  TwitchPlayer,
  type,
  OpenedDate,
  setIsPaused,
}) => {
  useEffect(() => {
    console.log("TCL: TwitchPlayer", TwitchPlayer);
    const volumeEventOverlayRefElement = volumeEventOverlayRef.current;

    const mouseEvents = e => {
      switch (e.button) {
        case 1:
          TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
          setVolumeMuted(!TwitchPlayer.getMuted());
          break;

        case 0:
          if (TwitchPlayer.isPaused()) {
            TwitchPlayer.play();
            setIsPaused(false);
          } else if (TwitchPlayer.getMuted() && new Date().getTime() - OpenedDate <= 15000) {
            TwitchPlayer.setMuted(false);
            setVolumeMuted(false);
          }
          break;

        case 1:
          TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
          setVolumeMuted(!TwitchPlayer.getMuted());
          break;

        case 1:
          TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
          setVolumeMuted(!TwitchPlayer.getMuted());
          break;

        default:
          break;
      }
    };

    const changeVolume = (operator, amount) => {
      if (TwitchPlayer.getMuted()) {
        TwitchPlayer.setMuted(false);
        setVolumeMuted(false);
      }

      const newVolume = Math.min(
        Math.max(
          operator === "increase"
            ? TwitchPlayer.getVolume() + amount
            : TwitchPlayer.getVolume() - amount,
          0
        ),
        1
      );

      TwitchPlayer.setVolume(newVolume);
      setVolumeText(newVolume * 100);
    };

    const scrollChangeVolumeEvent = e => {
      if ((e.wheelDelta && e.wheelDelta > 0) || e.deltaY < 0) {
        changeVolume("increase", 0.01);
      } else {
        changeVolume("decrease", 0.01);
      }
    };

    const keyboardEvents = e => {
      // console.time();
      switch (e.key) {
        case " ":
        case "Space":
          if (!TwitchPlayer.isPaused()) {
            TwitchPlayer.pause();
            setIsPaused(true);
          } else {
            TwitchPlayer.play();
            setIsPaused(false);
          }
          break;
        case "f":
        case "F":
          toggleFullscreen2();
          break;
        case "m":
        case "M":
          TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
          setVolumeMuted(!TwitchPlayer.getMuted());
          break;
        case "ArrowDown":
          changeVolume("decrease", 0.05);
          break;
        case "ArrowUp":
          changeVolume("increase", 0.05);
          break;
        default:
          break;
      }
      // console.timeEnd();
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

    const toggleFullscreen2 = () => {
      const isFullScreen = TwitchPlayer.getFullscreen();
      TwitchPlayer.setFullscreen(!isFullScreen);
      TwitchPlayer.showPlayerControls(!isFullScreen);

      if (TwitchPlayer.getFullscreen() && document.fullscreenElement) {
        document.exitFullscreen();
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
      setVolumeMuted(TwitchPlayer.getMuted());
      setVolumeText(TwitchPlayer.getVolume() * 100);
      if (volumeEventOverlayRefElement) {
        volumeEventOverlayRefElement.addEventListener("wheel", scrollChangeVolumeEvent);
        volumeEventOverlayRefElement.addEventListener("mousedown", mouseEvents);
      }
      document.body.addEventListener("keydown", keyboardEvents);
      // document.body.addEventListener("dblclick", toggleFullscreen);
    };

    TwitchPlayer.addEventListener(window.Twitch.Player.READY, twitchPlayerEventListeners);

    return () => {
      volumeEventOverlayRefElement.removeEventListener("wheel", scrollChangeVolumeEvent);
      volumeEventOverlayRefElement.removeEventListener("mousedown", mouseEvents);
      document.body.removeEventListener("keydown", keyboardEvents);
      TwitchPlayer.removeEventListener(window.Twitch.Player.READY, twitchPlayerEventListeners);
      // document.body.removeEventListener("dblclick", toggleFullscreen);
    };
  }, [
    volumeEventOverlayRef,
    setVolumeMuted,
    setVolumeText,
    TwitchPlayer,
    type,
    OpenedDate,
    setIsPaused,
  ]);

  return null;
};
