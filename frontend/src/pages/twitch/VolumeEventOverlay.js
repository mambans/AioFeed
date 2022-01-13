import React, { useRef, useState } from 'react';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import { StyledVolumeEventOverlay } from './player/StyledComponents';
import toggleFullscreenFunc from './player/toggleFullscreenFunc';
import { CSSTransition } from 'react-transition-group';
import { throttle } from 'lodash';
import VolumeSlider from './player/VolumeSlider';
import PlayPauseButton from './player/PlayPauseButton';
import ShowStatsButtons from './player/ShowStatsButtons';
import ShowSetQualityButtons from './player/ShowSetQualityButtons';
import Schedule from './schedule';
import ContextMenuWrapper from './player/ContextMenuWrapper';

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
      channelName,
      contextMenuChildren,
      ContextMenu,
      focused,
    },
    ref
  ) => {
    // eslint-disable-next-line no-unused-vars
    const [seekTime, setSeekTime] = useState();
    const [showControlls, setShowControlls] = useState();
    const seekresetTimer = useRef();
    const fadeTimer = useRef();

    useEventListenerMemo(
      'keydown',
      keyboardEvents,
      VolumeEventOverlayRef.current,
      addEventListeners && window?.Twitch?.Player?.READY && focused
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
          setSeekTime((c) => {
            clearTimeout(seekresetTimer.current);
            const curr = c || player.current.getCurrentTime();
            player.current.seek(curr + 10);
            seekresetTimer.current = setTimeout(() => setSeekTime(null), 3000);
            return curr + 10;
          });
          return;
        case 'ArrowLeft':
          setSeekTime((c) => {
            clearTimeout(seekresetTimer.current);
            const curr = c || player.current.getCurrentTime();
            player.current.seek(curr - 10);
            seekresetTimer.current = setTimeout(() => setSeekTime(null), 3000);
            return curr - 10;
          });
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
          {ContextMenu ||
            (contextMenuChildren && (
              <ContextMenuWrapper
                outerContainer={VolumeEventOverlayRef.current}
                showAndResetTimer={showAndResetTimer}
                children={<>{contextMenuChildren}</>}
                includeMarginTop={true}
              />
            ))}
          {showVolumeSlider && player.current && (
            <>
              <Schedule user={channelName} />
              <PlayPauseButton
                TwitchPlayer={player.current}
                PlayerUIControlls={VolumeEventOverlayRef.current}
              />
              <VolumeSlider
                // OpenedDate={OpenedDate}
                PlayerUIControlls={VolumeEventOverlayRef.current}
                TwitchPlayer={player.current}
                setShowControlls={setShowControlls}
                showAndResetTimer={showAndResetTimer}
              />
              <ShowStatsButtons TwitchPlayer={player.current} focused={focused} />
              <ShowSetQualityButtons TwitchPlayer={player.current} />
            </>
          )}
          {children}
        </StyledVolumeEventOverlay>
      </CSSTransition>
    );
  }
);
export default VolumeEventOverlay;
