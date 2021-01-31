// import { CSSTransition } from 'react-transition-group';
import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useRef, useState } from 'react';

import NavigationContext from './../../navigation/NavigationContext';
import { LoopBtn } from './StyledComponents';
// import PlayerNavbar from './PlayerNavbar';
import API from '../API';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import useQuery from '../../../hooks/useQuery';

export default () => {
  const channelName = useParams()?.channelName;
  const videoId = useParams()?.videoId;
  const time = useQuery().get('t') || useQuery().get('start') || null;
  const endTime = useQuery().get('end') || null;

  const { setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);

  const [twitchVideoPlayer, setTwitchVideoPlayer] = useState();
  const endTimeRef = useRef();

  const [loopEnabled, setLoopEnabled] = useState();

  const loopVideo = () => {
    loopEnabled &&
      twitchVideoPlayer.seek(
        time
          ? time.includes('s')
            ? time
                .split(/[hms:]+/)
                .slice(0, -1)
                .reduce((acc, ti) => 60 * acc + +ti)
            : time.split(/[hm:]+/).reduce((acc, ti) => 60 * acc + +ti)
          : 0
      );
  };

  useEventListenerMemo(window.Twitch.Player.ENDED, loopVideo, twitchVideoPlayer);

  useEffect(() => {
    setTwitchVideoPlayer(
      new window.Twitch.Player('twitch-embed', {
        width: '100%',
        height: '100%',
        theme: 'dark',
        layout: 'video',
        video: videoId || null,
        muted: false,
        time: time,
        allowfullscreen: true,
        parent: ['aiofeed.com'],
      })
    );
  }, [setShrinkNavbar, setFooterVisible, setVisible, channelName, videoId, time]);

  useEffect(() => {
    document.title = `${(channelName && `${channelName} -`) || ''} ${videoId}`;

    const fetchDetailsForDocumentTitle = async () => {
      if (twitchVideoPlayer) {
        const videoDetails = await API.getVideos({ params: { id: videoId } }).then(
          (r) => r.data.data[0]
        );

        document.title = `${videoDetails?.user_name || channelName || ''} - ${
          videoDetails?.title || videoId
        }`;

        if (videoDetails?.user_name && !channelName) {
          window.history.pushState(
            {},
            `${videoDetails?.user_name || ''} - ${videoDetails?.title || videoId}`,
            `/${videoDetails?.user_name}/videos/${videoId}${time ? `?t=${time}` : ''}`
          );
        }
      }
    };

    const timer = setTimeout(fetchDetailsForDocumentTitle, 500);

    return () => clearTimeout(timer);
  }, [videoId, channelName, twitchVideoPlayer, time]);

  useEffect(() => {
    if (twitchVideoPlayer && endTime && loopEnabled) {
      const setAndStartTimer = () => {
        const startTimeInSeconds = time
          ? time.includes('s')
            ? time
                .split(/[hms:]+/)
                .slice(0, -1)
                .reduce((acc, ti) => 60 * acc + +ti)
            : time.split(/[hm:]+/).reduce((acc, ti) => 60 * acc + +ti)
          : 0;

        const endTimeInSeconds = endTime.includes('s')
          ? endTime
              .split(/[hms:]+/)
              .slice(0, -1)
              .reduce((acc, ti) => 60 * acc + +ti)
          : endTime.split(/[hm:]+/).reduce((acc, ti) => 60 * acc + +ti);

        clearTimeout(endTimeRef.current);
        endTimeRef.current = setTimeout(() => {
          twitchVideoPlayer.seek(startTimeInSeconds);
          setAndStartTimer();
        }, (endTimeInSeconds - startTimeInSeconds) * 1000);
      };

      setAndStartTimer();
    }
  }, [endTime, time, twitchVideoPlayer, loopEnabled]);

  return (
    <>
      <OverlayTrigger
        key='loop'
        placement={'left'}
        delay={{ show: 500, hide: 0 }}
        overlay={
          <Tooltip id={`tooltip-${'left'}`}>{`${
            loopEnabled ? 'Disable ' : 'Enable '
          } loop`}</Tooltip>
        }
      >
        <LoopBtn
          size={32}
          enabled={loopEnabled}
          onClick={() => {
            setLoopEnabled((cr) => {
              if (twitchVideoPlayer.getEnded() && !cr) {
                twitchVideoPlayer.seek(0);
              }
              return !cr;
            });
          }}
        />
      </OverlayTrigger>
      {/* <div id='twitch-embed' style={{ gridArea: 'video' }}></div> */}
    </>
  );
};
