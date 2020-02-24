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
    // console.log("TCL: TwitchPlayer", TwitchPlayer);
    // let TwitchPlayer = new window.Twitch.Player("twitch-embed", {
    //   width: "100%",
    //   height: "100%",
    //   theme: "dark",
    //   layout: "video",
    //   channel: channel || null,
    //   video: video || null,
    //   muted: false,
    // });

    const volumeEventOverlayRefElement = volumeEventOverlayRef.current;

    const scrollChangeVolumeEvent = e => {
      if (TwitchPlayer.getMuted()) {
        TwitchPlayer.setMuted(false);
        setVolumeMuted(false);
      }

      if ((e.wheelDelta && e.wheelDelta > 0) || e.deltaY < 0) {
        const newVolume = TwitchPlayer.getVolume() + 0.01;
        if (newVolume < 1) {
          TwitchPlayer.setVolume(newVolume);
          setVolumeText(newVolume * 100);
        } else {
          TwitchPlayer.setVolume(1);
          setVolumeText(100);
        }
      } else {
        const newVolume = TwitchPlayer.getVolume() - 0.01;
        if (newVolume > 0) {
          TwitchPlayer.setVolume(newVolume);
          setVolumeText(newVolume * 100);
        } else {
          TwitchPlayer.setVolume(0);
          setVolumeText(0);
        }
      }
    };

    const clickUnmuteMuteOrPlay = e => {
      if (e.button === 1) {
        TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
        setVolumeMuted(!TwitchPlayer.getMuted());
      } else if (e.button === 0 && TwitchPlayer.isPaused()) {
        TwitchPlayer.play();
        setIsPaused(false);
        if (TwitchPlayer.getVolume() <= 0) {
          TwitchPlayer.setVolume(0.05);
          setVolumeText(5);
        }
      } else if (
        e.button === 0 &&
        TwitchPlayer.getMuted() &&
        new Date().getTime() - OpenedDate <= 15000
      ) {
        TwitchPlayer.setMuted(false);
        setVolumeMuted(false);
        if (TwitchPlayer.getVolume() <= 0) {
          TwitchPlayer.setVolume(0.05);
          setVolumeText(5);
        }
      }
    };

    const keyboardEvents = e => {
      if (e.key === "Space" || e.keyCode === 32) {
        if (TwitchPlayer.isPaused()) {
          TwitchPlayer.play();
          setIsPaused(false);
        } else {
          TwitchPlayer.pause();
          setIsPaused(true);
        }
      } else if (e.key === "f") {
        toggleFullscreen2();
      } else if (e.key === "m") {
        TwitchPlayer.setMuted(!TwitchPlayer.getMuted());
        setVolumeMuted(!TwitchPlayer.getMuted());
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

    const toggleFullscreen2 = () => {
      TwitchPlayer.setFullscreen(!TwitchPlayer.getFullscreen());
      if (TwitchPlayer.getFullscreen()) {
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
      if (type === "live") TwitchPlayer.showPlayerControls();
      setVolumeMuted(TwitchPlayer.getMuted());
      setVolumeText(TwitchPlayer.getVolume() * 100);
      if (volumeEventOverlayRefElement) {
        volumeEventOverlayRefElement.addEventListener("wheel", scrollChangeVolumeEvent);
        volumeEventOverlayRefElement.addEventListener("mouseup", clickUnmuteMuteOrPlay);
      }
      document.body.addEventListener("keyup", keyboardEvents);
      // document.body.addEventListener("dblclick", toggleFullscreen);
    };

    TwitchPlayer.addEventListener(window.Twitch.Player.READY, twitchPlayerEventListeners);

    return () => {
      volumeEventOverlayRefElement.removeEventListener("wheel", scrollChangeVolumeEvent);
      volumeEventOverlayRefElement.removeEventListener("mouseup", clickUnmuteMuteOrPlay);
      document.body.removeEventListener("keyup", keyboardEvents);
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
