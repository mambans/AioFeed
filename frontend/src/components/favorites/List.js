import React, { useContext, useEffect, useState } from 'react';
import { debounce } from 'lodash';

import AddVideoExtraData from '../twitch/AddVideoExtraData';
import API from '../twitch/API';
import VodElement from '../twitch/vods/VodElement';
import YoutubeVideoElement from '../youtube/YoutubeVideoElement';
import GetVideoInfo from './GetVideoInfo';
import { VideosContainer } from './StyledComponents';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { LoadingVideoElement } from '../twitch/StyledComponents';
import { addVodEndTime } from '../twitch/TwitchUtils';
import { LoadMore } from '../sharedStyledComponents';
import { CenterContext } from '../feed/FeedsCenterContainer';

export default ({ list, ytExistsAndValidated, twitchExistsAndValidated }) => {
  const [videos, setVideos] = useState();
  const { videoElementsAmount } = useContext(CenterContext);

  const [videosToShow, setVideosToShow] = useState({
    amount: videoElementsAmount,
    timeout: 750,
    transitionGroup: 'videos',
  });

  useEffect(() => {
    debounce(
      () => {
        setVideosToShow({
          amount: videoElementsAmount,
          timeout: 750,
          transitionGroup: 'videos',
        });
      },
      500,
      { leading: true, trailing: true }
    );
  }, [videoElementsAmount]);

  useEffect(() => {
    (async () => {
      if (list?.items) {
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

        const twitchItemsWithDetails = Boolean(twitchItems?.length)
          ? twitchExistsAndValidated
            ? await twitchFetchVideos(twitchItems)
            : twitchItems.map((video) => ({ id: video, loading: true }))
          : [];

        const youtubeItemsWithDetails = Boolean(youtubeItems?.length)
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

        // setVideos(mergeVideosOrdered);
        setVideos((curr) => {
          return mergeVideosOrdered.map((vid) => {
            const found = curr?.find((c) => c.id === vid.id);
            if (!found && Boolean(curr?.length)) return { ...vid, transition: 'videoFadeSlide' };
            return vid;
          });
        });
      }
    })();
  }, [list.items, ytExistsAndValidated, twitchExistsAndValidated]);

  return (
    <VideosContainer>
      <TransitionGroup component={null} className={videosToShow.transitionGroup || 'videos'}>
        {videos?.slice(0, videosToShow.amount).map((video) => {
          return (
            <CSSTransition
              key={`${list.name}-${video.contentDetails?.upload?.videoId || video.id}`}
              timeout={videosToShow.timeout}
              classNames={video.transition || 'fade-750ms'}
              // classNames='videoFadeSlide'
              unmountOnExit
            >
              {video.loading ? (
                <LoadingVideoElement type={'small'} />
              ) : video?.kind === 'youtube#video' ? (
                <YoutubeVideoElement video={video} disableContextProvider={true} />
              ) : (
                <VodElement data={video} disableContextProvider={true} />
              )}
            </CSSTransition>
          );
        })}
      </TransitionGroup>
      <LoadMore
        loaded={true}
        setVideosToShow={setVideosToShow}
        videosToShow={videosToShow}
        videos={videos}
      />
    </VideosContainer>
  );
};
