import { useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

import TwitchAPI from '../API';
import useQuery from '../../../hooks/useQuery';
import Loopbar, { timeToSeconds } from './Loopbar';
import { LoopBtn, Loop } from './StyledComponents';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import ToolTip from '../../sharedComponents/ToolTip';
import Schedule from '../schedule';

const VideoPlayer = ({ listIsOpen, listWidth, playNext }) => {
  const channelName = useParams()?.channelName;
  const videoId = useParams()?.videoId;
  const queryTime = useQuery().get('t') || null;
  const queryTime2 = useQuery().get('start') || null;

  const time = queryTime || queryTime2 || null;
  const endTime = useQuery().get('end') || null;
  const twitchVideoPlayer = useRef();
  const [loopEnabled, setLoopEnabled] = useState(Boolean(useQuery().get('loop')));
  const [duration, setDuration] = useState();
  const [videoDetails, setVideoDetails] = useState();

  useEffect(() => {
    (async () => {
      const fetchLatestVodId = async () => {
        const user = await TwitchAPI.getUser({
          login: channelName,
        }).then((res) =>
          res.data.data.find(
            (u) =>
              u.display_name.toLowerCase() === channelName.toLowerCase() ||
              u.login.toLowerCase() === channelName.toLowerCase()
          )
        );
        console.log('user:', user);

        const video = await TwitchAPI.getVideos({
          user_id: user.id,
          period: 'month',
          first: 1,
          type: 'all',
        }).then((res) =>
          res.data.data.find((v) => v.username.toLowerCase() === channelName.toLowerCase())
        );

        console.log('video:', video);
        return video;
      };

      const video =
        videoId && videoId.toLowerCase() !== 'latest'
          ? videoId || (await fetchLatestVodId().then((v) => v.id))
          : null;
      console.log('video:', video);
      const playerParams = {
        width: '100%',
        height: '100%',
        theme: 'dark',
        layout: 'video',
        video: video || null,
        muted: false,
        time: timeToSeconds(time),
        allowfullscreen: true,
        parent: ['aiofeed.com'],
      };

      if (twitchVideoPlayer.current) {
        twitchVideoPlayer.current.setVideo(videoId, timeToSeconds(time));
      } else if (window?.Twitch?.Player) {
        twitchVideoPlayer.current = new window.Twitch.Player('twitch-embed', playerParams);
      }
    })();
  }, [videoId, time, latest, channelName]);

  useEventListenerMemo(
    window?.Twitch?.Player?.PLAYING,
    () => {
      setDuration(twitchVideoPlayer.current.getDuration());
    },
    twitchVideoPlayer.current
  );
  useEventListenerMemo(window?.Twitch?.Player?.ENDED, playNext, twitchVideoPlayer.current);

  useEffect(() => {
    document.title = `${(channelName && `${channelName} -`) || ''} ${videoId}`;

    const fetchDetailsForDocumentTitle = async () => {
      if (twitchVideoPlayer.current) {
        const fetchedvideoDetails = await TwitchAPI.getVideos({ id: videoId }).then(
          (r) => r.data.data[0]
        );

        setVideoDetails(fetchedvideoDetails);

        document.title = `${fetchedvideoDetails?.user_name || channelName || ''} - ${
          fetchedvideoDetails?.title || videoId
        }`;

        if (fetchedvideoDetails?.user_name && !channelName) {
          window.history.pushState(
            {},
            `${fetchedvideoDetails?.user_name || ''} - ${fetchedvideoDetails?.title || videoId}`,
            `/${fetchedvideoDetails?.user_name}/videos/${videoId}${time ? `?start=${time}` : ''}${
              endTime ? `&end=${endTime}` : ''
            }${loopEnabled ? `&loop=${loopEnabled}` : ''}`
          );
        }
      }
    };

    const timer = setTimeout(fetchDetailsForDocumentTitle, 500);

    return () => clearTimeout(timer);
  }, [videoId, channelName, twitchVideoPlayer, time, endTime, loopEnabled]);

  return (
    <>
      <Schedule
        user_id={videoDetails?.user_id}
        user={videoDetails?.login || videoDetails?.user_name || channelName}
      />
      <Loop listIsOpen={String(listIsOpen)} listWidth={listWidth} loopEnabled={String(loopEnabled)}>
        {twitchVideoPlayer.current && (
          <ToolTip
            placement='right'
            delay={{ show: 500, hide: 0 }}
            tooltip={`${loopEnabled ? 'Disable ' : 'Enable '} loop`}
            width='max-content'
          >
            <LoopBtn
              size={32}
              enabled={String(loopEnabled)}
              onClick={() => {
                setLoopEnabled((cr) => {
                  if (twitchVideoPlayer.current.getEnded() && !cr) {
                    twitchVideoPlayer.current.seek(0);
                  }
                  window.history.pushState(
                    {},
                    `${window.location}${loopEnabled ? `&loop=${loopEnabled}` : ''}`
                  );
                  return !cr;
                });
              }}
            />
          </ToolTip>
        )}

        {twitchVideoPlayer.current && loopEnabled && (
          <Loopbar
            twitchVideoPlayer={twitchVideoPlayer.current}
            duration={duration}
            loopEnabled={loopEnabled}
          />
        )}

        {/* <div id='twitch-embed' style={{ gridArea: 'video' }}></div> */}
      </Loop>
    </>
  );
};
export default VideoPlayer;
