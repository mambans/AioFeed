const toggleFullscreenFunc = ({
  event,
  videoElementRef,
  setChatState,
  hideChatDelay,
  hideChatSaved,
  setIsFullscreen,
}) => {
  event.preventDefault();
  const video = videoElementRef.current;
  if (
    (document.fullScreenElement !== undefined && document.fullScreenElement === null) ||
    (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) ||
    (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
    (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)
  ) {
    if (hideChatDelay.current) clearTimeout(hideChatDelay.current);
    hideChatDelay.current = setTimeout(() => {
      setChatState((curr) => {
        delete curr?.default;
        return { ...curr, hideChat: true };
      });
    }, 5000);
    setIsFullscreen(true);
    if (video.requestFullScreen) {
      video.requestFullScreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullScreen) {
      video.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  } else {
    if (hideChatDelay.current) clearTimeout(hideChatDelay.current);
    setChatState((curr) => {
      delete curr?.default;
      return { ...curr, hideChat: hideChatSaved.current };
    });
    setIsFullscreen(false);
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
};
export default toggleFullscreenFunc;
