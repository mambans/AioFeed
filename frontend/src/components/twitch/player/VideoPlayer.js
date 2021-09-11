import { useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

import TwitchAPI from '../API';
import useQuery from '../../../hooks/useQuery';
import Loopbar, { timeToSeconds } from './Loopbar';
import { LoopBtn, Loop } from './StyledComponents';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import ToolTip from '../../sharedComponents/ToolTip';
import Schedule from '../schedule';

const VideoPlayer = ({ listIsOpen, listWidth, playNext, childPlayer = {}, setIsPlaying }) => {
  const channelName = useParams()?.channelName;
  const videoId = useParams()?.videoId;
  const queryTime = useQuery().get('t') || null;
  const queryTime2 = useQuery().get('start') || null;
  const query_user_id = useQuery().get('user_id');

  const time = queryTime || queryTime2 || null;
  const endTime = useQuery().get('end') || null;
  const twitchVideoPlayer = useRef();
  const [loopEnabled, setLoopEnabled] = useState(Boolean(useQuery().get('loop')));
  const [duration, setDuration] = useState();
  const [videoDetails, setVideoDetails] = useState();

  useEventListenerMemo(
    window?.Twitch?.Player?.PLAYING,
    OnPlayingEventListeners,
    twitchVideoPlayer.current,
    twitchVideoPlayer.current
  );

  useEventListenerMemo(
    window?.Twitch?.Player?.PAUSE,
    OnPauseEventListeners,
    twitchVideoPlayer.current,
    twitchVideoPlayer.current
  );
  useEventListenerMemo(
    window?.Twitch?.Player?.ENDED,
    OnPauseEventListeners,
    twitchVideoPlayer.current,
    twitchVideoPlayer.current
  );

  function OnPlayingEventListeners() {
    setIsPlaying(true);
  }

  function OnPauseEventListeners() {
    setIsPlaying(false);
  }

  useEffect(() => {
    (async () => {
      const fetchLatestVodId = async () => {
        const user =
          query_user_id ||
          (await TwitchAPI.getUser({
            login: channelName,
          }).then(
            (res) =>
              res.data.data.find(
                (u) =>
                  u.display_name?.toLowerCase() === channelName?.toLowerCase() ||
                  u.login?.toLowerCase() === channelName?.toLowerCase()
              ).id
          ));

        const video = await TwitchAPI.getVideos({
          user_id: user,
          period: 'month',
          first: 1,
          type: 'all',
        }).then((res) =>
          res.data.data.find(
            (v) =>
              v?.user_name?.toLowerCase() === channelName?.toLowerCase() ||
              v?.user_login?.toLowerCase() === channelName?.toLowerCase()
          )
        );

        return video;
      };

      const video = await (async () => {
        if (videoId && videoId.toLowerCase() !== 'latest') return videoId;
        return await fetchLatestVodId().then((v) => v.id);
      })();

      if (video) {
        const playerParams = {
          width: '100%',
          height: '100%',
          theme: 'dark',
          layout: 'video',
          video: video,
          muted: false,
          time: timeToSeconds(time),
          allowfullscreen: true,
          parent: ['aiofeed.com'],
        };

        if (twitchVideoPlayer.current) {
          twitchVideoPlayer.current.setVideo(videoId, timeToSeconds(time));
          childPlayer.current = twitchVideoPlayer.current;
        } else if (window?.Twitch?.Player) {
          twitchVideoPlayer.current = new window.Twitch.Player('twitch-embed', playerParams);
          childPlayer.current = twitchVideoPlayer.current;
        }
      }
    })();
  }, [videoId, time, channelName, query_user_id, childPlayer]);

  useEventListenerMemo(
    window?.Twitch?.Player?.PLAYING,
    () => {
      setDuration(twitchVideoPlayer.current.getDuration());
    },
    twitchVideoPlayer.current
  );
  useEventListenerMemo(window?.Twitch?.Player?.ENDED, playNext, twitchVideoPlayer.current);

  useEffect(() => {
    if (videoId?.toLowerCase() !== 'latest') {
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
    }
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
