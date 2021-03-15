import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import NavigationContext from './../../navigation/NavigationContext';
import API from '../API';
import useQuery from '../../../hooks/useQuery';
import Loopbar, { timeToSeconds } from './Loopbar';
import { LoopBtn, Loop } from './StyledComponents';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';

export default ({ listIsOpen, listWidth }) => {
  const channelName = useParams()?.channelName;
  const videoId = useParams()?.videoId;
  const time = useQuery().get('t') || useQuery().get('start') || null;
  const endTime = useQuery().get('end') || null;
  const { setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const [twitchVideoPlayer, setTwitchVideoPlayer] = useState();
  const [loopEnabled, setLoopEnabled] = useState(Boolean(time));
  const [duration, setDuration] = useState();

  useEffect(() => {
    setTwitchVideoPlayer(
      new window.Twitch.Player('twitch-embed', {
        width: '100%',
        height: '100%',
        theme: 'dark',
        layout: 'video',
        video: videoId || null,
        muted: false,
        time: timeToSeconds(time),
        allowfullscreen: true,
        parent: ['aiofeed.com'],
      })
    );
  }, [setShrinkNavbar, setFooterVisible, setVisible, channelName, videoId, time]);

  useEventListenerMemo(
    window.Twitch.Player.PLAYING,
    () => {
      setDuration(twitchVideoPlayer.getDuration());
    },
    twitchVideoPlayer
  );

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
            `/${videoDetails?.user_name}/videos/${videoId}${time ? `?start=${time}` : ''}${
              endTime ? `&end=${endTime}` : ''
            }`
          );
        }
      }
    };

    const timer = setTimeout(fetchDetailsForDocumentTitle, 500);

    return () => clearTimeout(timer);
  }, [videoId, channelName, twitchVideoPlayer, time, endTime]);

  return (
    <Loop listIsOpen={String(listIsOpen)} listWidth={listWidth} loopEnabled={String(loopEnabled)}>
      {twitchVideoPlayer && (
        <OverlayTrigger
          key='loop'
          placement='right'
          delay={{ show: 500, hide: 0 }}
          overlay={
            <Tooltip id='loopbtn-tooltip-right'>{`${
              loopEnabled ? 'Disable ' : 'Enable '
            } loop`}</Tooltip>
          }
        >
          <LoopBtn
            size={32}
            enabled={String(loopEnabled)}
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
      )}
      {twitchVideoPlayer && loopEnabled && (
        <Loopbar twitchVideoPlayer={twitchVideoPlayer} duration={duration} />
      )}

      {/* <div id='twitch-embed' style={{ gridArea: 'video' }}></div> */}
    </Loop>
  );
};
