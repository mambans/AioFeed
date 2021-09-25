import React, { useRef, useState } from 'react';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import { StyledVolumeEventOverlay } from './player/StyledComponents';
import toggleFullscreenFunc from './player/toggleFullscreenFunc';
import { CSSTransition } from 'react-transition-group';
import { throttle } from 'lodash';
import VolumeSlider from './player/VolumeSlider';

const VolumeEventOverlay = React.forwardRef(
  (
    {
      children,
      show,
      type,
      id,
      hidechat,
      vodVolumeOverlayEnabled,
      chatwidth,
      showcursor,
      VolumeEventOverlayRef,
      player,
      videoElementRef,
      style,
      showVolumeSlider,
      addEventListeners = false,
      centerBotttom,
    },
    ref
  ) => {
    const [seekTime, setSeekTime] = useState();
    const [showControlls, setShowControlls] = useState();
    const seekresetTimer = useRef();
    const fadeTimer = useRef();

    useEventListenerMemo(
      'keydown',
      keyboardEvents,
      window,
      addEventListeners && window?.Twitch?.Player?.READY
    );
    useEventListenerMemo(
      'dblclick',
      toggleFullScreen,
      VolumeEventOverlayRef.current,
      addEventListeners
    );

    const showAndResetTimer = throttle(
      () => {
        setShowControlls(true);
        clearTimeout(fadeTimer.current);

        fadeTimer.current = setTimeout(() => setShowControlls(false), 1250);
      },
      150,
      { leading: true, trailing: false }
    );

    useEventListenerMemo(
      'mousemove',
      showAndResetTimer,
      VolumeEventOverlayRef.current,
      addEventListeners
    );
    useEventListenerMemo(
      'mousedown',
      showAndResetTimer,
      VolumeEventOverlayRef.current,
      addEventListeners
    );
    useEventListenerMemo(
      'touchmove',
      showAndResetTimer,
      VolumeEventOverlayRef.current,
      addEventListeners
    );

    function keyboardEvents(e) {
      switch (e.key) {
        case 'f':
        case 'F':
          toggleFullScreen(e);
          break;
        case 'q':
        case 'Q':
          e.preventDefault();
          player.current?.setQuality('chunked');
          break;
        case ' ':
          e.preventDefault();
          player.current.isPaused() ? player.current.play() : player.current.pause();
          break;
        case 'ArrowRight':
          if (!seekTime) {
            setSeekTime(player.current.getCurrentTime());
            player.current.seek(player.current.getCurrentTime() + 10);
            clearTimeout(seekresetTimer.current);
            seekresetTimer.current = setTimeout(() => setSeekTime(null), 3000);
            return;
          }
          player.current.seek(seekTime + 10);
          setSeekTime(seekTime + 10);
          break;
        case 'ArrowLeft':
          if (!seekTime) {
            setSeekTime(player.current.getCurrentTime());
            player.current.seek(player.current.getCurrentTime() - 10);
            clearTimeout(seekresetTimer.current);
            seekresetTimer.current = setTimeout(() => setSeekTime(null), 3000);
            return;
          }

          player.current.seek(seekTime - 10);
          setSeekTime(seekTime - 10);
          break;
        default:
          break;
      }
    }

    function toggleFullScreen(event) {
      toggleFullscreenFunc({
        event,
        videoElementRef,
      });
    }

    return (
      <CSSTransition
        in={show && showControlls}
        key={'controllsUI'}
        timeout={1000}
        classNames='fade-controllUI-1s'
      >
        <StyledVolumeEventOverlay
          style={style}
          ref={ref}
          show={show}
          type={type}
          id={id}
          hidechat={hidechat}
          vodVolumeOverlayEnabled={vodVolumeOverlayEnabled}
          chatwidth={chatwidth}
          showcursor={showcursor}
          centerBotttom={centerBotttom}
        >
          {showVolumeSlider && (
            <VolumeSlider
              // OpenedDate={OpenedDate}
              PlayerUIControlls={VolumeEventOverlayRef.current}
              TwitchPlayer={player.current}
              setShowControlls={setShowControlls}
              showAndResetTimer={showAndResetTimer}
            />
          )}
          {children}
        </StyledVolumeEventOverlay>
      </CSSTransition>
    );
  }
);
export default VolumeEventOverlay;
