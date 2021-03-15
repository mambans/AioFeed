import React, { useState, useCallback, useEffect, useRef } from 'react';

import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import useQuery from '../../../hooks/useQuery';
import {
  LoopTimebarBackground,
  LoopTimebarContainer,
  LoopPins,
  LoopTimebarEnabled,
  Backdrop,
} from './StyledComponents';

export const timeToSeconds = (time) => {
  if (!time) return null;

  return parseInt(
    time
      .replace('s', '')
      .replace(/h|m/g, ':')
      .split(':')
      .reduce((acc, time) => 60 * acc + +time)
  );
};

const secondsToHHMMSS = (s) => {
  try {
    return new Date(s * 1000).toISOString().substr(11, 8);
  } catch (e) {
    return '';
  }
};

export default ({ twitchVideoPlayer, duration = twitchVideoPlayer.getDuration() }) => {
  const urlStartTime = useQuery().get('t') || useQuery().get('start') || null;
  const urlEndTime = useQuery().get('end') || null;
  const [start, setStart] = useState({
    time: 0,
    pos: 0,
    active: false,
  });
  const [end, setEnd] = useState({
    time: 0,
    pos: 0,
    active: false,
  });
  const ref = useRef();
  const endTimeRef = useRef();

  const handleResizeMouseUp = () => {
    setStart((cur) => ({ ...cur, active: false }));
    setEnd((cur) => ({ ...cur, active: false }));

    seek();
    setAndStartTimer();
  };

  const setAndStartTimer = useCallback(() => {
    const currrentTime = twitchVideoPlayer.getCurrentTime();

    clearTimeout(endTimeRef.current);
    endTimeRef.current = setTimeout(() => {
      twitchVideoPlayer.seek(start.time);
      setTimeout(() => {
        setAndStartTimer();
      }, 10000);
    }, ((end.time || duration || twitchVideoPlayer.getDuration()) - currrentTime) * 1000);

    return () => clearTimeout(endTimeRef.current);
  }, [duration, end.time, start.time, twitchVideoPlayer]);

  const resize = useCallback(
    (e) => {
      if (!end.active && !start.active) return false;

      const mouseX = Math.max(e.clientX - 20, 0);
      const newObj = {
        time: (duration || twitchVideoPlayer.getDuration() / ref.current.clientWidth) * mouseX,
        pos: mouseX,
        active: true,
      };

      if (start.active) setStart(newObj);
      if (end.active) setEnd(newObj);
    },
    [duration, end, start, setStart, setEnd, twitchVideoPlayer]
  );

  const seek = () => {
    const currrentTime = twitchVideoPlayer.getCurrentTime();
    if (start.time > currrentTime) twitchVideoPlayer.seek(start.time);
    if (end?.time && end?.time < currrentTime) twitchVideoPlayer.seek(end.time);

    window.history.pushState(
      {},
      document.title,
      `${window.location.origin + window.location.pathname}?start=${new Date(start.time * 1000)
        .toISOString()
        .substr(11, 8)}&end=${new Date(end.time * 1000).toISOString().substr(11, 8)}`
    );
  };

  const loopVideo = () => {
    if (start && urlStartTime) {
      twitchVideoPlayer.seek(timeToSeconds(urlStartTime));
    } else {
      twitchVideoPlayer.seek(0);
    }
  };

  useEventListenerMemo('mouseup', handleResizeMouseUp, document, end.active || start.active);
  useEventListenerMemo('mousemove', resize, document, end.active || start.active);
  useEventListenerMemo(window.Twitch.Player.ENDED, loopVideo, twitchVideoPlayer);
  useEventListenerMemo(window.Twitch.Player.PLAYING, setAndStartTimer, twitchVideoPlayer);

  useEffect(() => {
    const startTime = timeToSeconds(urlStartTime);
    const endTime = timeToSeconds(urlEndTime);

    setStart({
      time: startTime,
      pos: startTime / (duration || twitchVideoPlayer.getDuration() / ref.current?.clientWidth),
      active: false,
    });

    setEnd({
      time: endTime,
      pos: endTime / (duration || twitchVideoPlayer.getDuration() / ref.current?.clientWidth),
      active: false,
    });
  }, [duration, urlEndTime, urlStartTime, twitchVideoPlayer]);

  return (
    <>
      {(end?.active || start?.active) && <Backdrop />}
      <LoopTimebarContainer ref={ref} active={end?.active || start?.active}>
        <LoopTimebarBackground>
          <LoopTimebarEnabled
            left={start.pos}
            width={end.pos ? `${end.pos - start.pos}px` : `calc(100% - ${start.pos || 0}px)`}
          >
            <LoopPins
              style={{ left: '0px', borderRadius: '5px 2px 2px 5px' }}
              onMouseDown={() => setStart((cur) => ({ ...cur, active: true }))}
              active={start.active}
            >
              <p>{secondsToHHMMSS(start?.time)}</p>
            </LoopPins>
            <p id='loopedDuration'>{secondsToHHMMSS(end?.time - start?.time)}</p>
            <LoopPins
              style={{ right: '0px', borderRadius: '2px 5px 5px 2px' }}
              onMouseDown={() => setEnd((cur) => ({ ...cur, active: true }))}
              active={end.active}
            >
              <p>{secondsToHHMMSS(end?.time)}</p>
            </LoopPins>
          </LoopTimebarEnabled>
        </LoopTimebarBackground>
      </LoopTimebarContainer>
    </>
  );
};
