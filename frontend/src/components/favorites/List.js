import React, { useEffect, useState } from 'react';
import AddVideoExtraData from '../twitch/AddVideoExtraData';
import API from '../twitch/API';
import VodElement from '../twitch/vods/VodElement';
import YoutubeVideoElement from '../youtube/YoutubeVideoElement';
import GetVideoInfo from './GetVideoInfo';
import { VideosContainer } from './StyledComponents';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { StyledLoadingBox } from '../twitch/StyledComponents';
import { durationToDate } from '../twitch/TwitchUtils';

export default ({ list, ytExistsAndValidated, twitchExistsAndValidated }) => {
  const [videos, setVideos] = useState();

  const addVodEndTime = async (followedStreamVods) => {
    return followedStreamVods.map((stream) => {
      stream.endDate =
        stream.type === 'archive'
          ? durationToDate(stream.duration, stream.created_at)
          : new Date(stream.created_at).getTime();

      return stream;
    });
  };

  useEffect(() => {
    (async () => {
      const twitchFetchVideos = async (items) => {
        const fetchedVideos = await API.getVideos({ params: { id: items } });
        const finallFetchedVideos = await AddVideoExtraData({
          items: fetchedVideos.data,
          fetchGameInfo: false,
        });

        return await addVodEndTime(finallFetchedVideos.data);
      };

      const youtubeFetchVideos = async (items) => await GetVideoInfo({ videos: items });

      const twitchItems = list.items
        .map((video) => typeof video === 'number' && video)
        .filter((i) => i);

      const youtubeItems = list.items
        .map((video) => typeof video === 'string' && video)
        .filter((i) => i);

      const twitchItemsWithDetails = Boolean(twitchItems.length)
        ? twitchExistsAndValidated
          ? await twitchFetchVideos(twitchItems)
          : twitchItems.map((video) => ({ id: video, loading: true }))
        : [];

      const youtubeItemsWithDetails = Boolean(youtubeItems.length)
        ? ytExistsAndValidated
          ? await youtubeFetchVideos(youtubeItems)
          : youtubeItems.map((video) => {
              return { id: video, contentDetails: { upload: { videoId: video } }, loading: true };
            })
        : [];

      const mergedVideosUnordered = [...twitchItemsWithDetails, ...youtubeItemsWithDetails];

      const mergeVideosOrdered = list.items
        .map((item) => mergedVideosUnordered.find((video) => String(video.id) === String(item)))
        .filter((i) => i);

      setVideos(mergeVideosOrdered);
    })();
  }, [list.items, ytExistsAndValidated, twitchExistsAndValidated]);

  return (
    <VideosContainer>
      <TransitionGroup component={null}>
        {videos?.map((video) => {
          return (
            <CSSTransition
              key={`${list.name}-${video.contentDetails?.upload?.videoId || video.id}`}
              timeout={750}
              classNames='videoFadeSlide'
              unmountOnExit
            >
              {video.loading ? (
                <StyledLoadingBox type={'small'}>
                  <div id='video'></div>
                  <div id='title'>
                    <div></div>
                  </div>
                  <div id='details'>
                    <div id='channel'></div>
                    <div id='game'></div>
                  </div>
                </StyledLoadingBox>
              ) : video?.kind === 'youtube#video' ? (
                <YoutubeVideoElement video={video} />
              ) : (
                <VodElement data={video} />
              )}
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </VideosContainer>
  );
};
