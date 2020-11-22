import React, { useContext, useEffect, useMemo, useState } from 'react';

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
import { restructureVideoList, uploadNewList } from './dragDropUtils';

export default ({ list, ytExistsAndValidated, twitchExistsAndValidated, setLists }) => {
  const [videos, setVideos] = useState();
  const [dragSelected, setDragSelected] = useState();
  const { videoElementsAmount, feedSizesObj } = useContext(CenterContext) || {};

  const [videosToShow, setVideosToShow] = useState({
    amount: videoElementsAmount,
    timeout: 750,
    transitionGroup: 'videos',
  });

  useEffect(() => {
    setVideosToShow({
      amount: videoElementsAmount,
      timeout: 750,
      transitionGroup: 'videos',
    });
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

        setVideos((curr) => {
          return mergeVideosOrdered.map((vid) => {
            const found = curr?.find((c) => c.id === vid.id);
            if (!found && Boolean(curr?.length))
              return { ...vid, transition: feedSizesObj.transition || 'videoFadeSlide' };
            return vid;
          });
        });
      }
    })();
  }, [list.items, ytExistsAndValidated, twitchExistsAndValidated, feedSizesObj.transition]);

  const dragEvents = useMemo(
    () => ({
      draggable: true,
      setDragSelected: setDragSelected,
      dragSelected: dragSelected,
      onDragEnd: (e) => uploadNewList(e, list.name, videos, setLists),
      // onDrop: (e) => uploadNewList(e, list.name, videos, setLists),
      onDragOver: (e) => restructureVideoList(e, videos, dragSelected, setVideos),
    }),
    [dragSelected, videos, list.name, setLists]
  );

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
                <YoutubeVideoElement
                  data-id={video.contentDetails?.upload?.videoId}
                  video={video}
                  disableContextProvider={true}
                  {...dragEvents}
                />
              ) : (
                <VodElement
                  data-id={video.id}
                  data={video}
                  disableContextProvider={true}
                  {...dragEvents}
                />
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
