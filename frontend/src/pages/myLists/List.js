import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import AddVideoExtraData from '../twitch/AddVideoExtraData';
import TwitchAPI from '../twitch/API';
import VodElement from '../twitch/vods/VodElement';
import YoutubeVideoElement from '../youtube/YoutubeVideoElement';
import GetVideoInfo from './GetVideoInfo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { LoadingVideoElement } from '../twitch/StyledComponents';
import { addVodEndTime } from '../twitch/TwitchUtils';
import LoadMore from '../../components/loadMore/LoadMore';
import { CenterContext } from '../feed/FeedsCenterContainer';
import { parseNumberAndString, restructureVideoList, uploadNewList } from './dragDropUtils';
import aiofeedAPI from '../navigation/API';
import { VideosContainer } from '../../components/styledComponents';

export const fetchListVideos = async ({
  list,
  ytExistsAndValidated,
  twitchExistsAndValidated,
  currentVideos = [],
}) => {
  if (list?.videos) {
    const twitchFetchVideos = async (items) => {
      const fetchedVideos = await TwitchAPI.getVideos({ id: items }).catch((e) => {
        console.log(e);
      });

      if (!fetchedVideos) return false;

      const finallFetchedVideos = await AddVideoExtraData({
        items: fetchedVideos.data,
        fetchGameInfo: false,
      });

      return await addVodEndTime(finallFetchedVideos.data);
    };

    const youtubeFetchVideos = async (items) => await GetVideoInfo({ videos: items });

    const twitchItems = list.videos
      .map((video) => typeof video === 'number' && video)
      .filter((i) => i);

    const youtubeItems = list.videos
      .map((video) => typeof video === 'string' && video)
      .filter((i) => i && !currentVideos.find((v) => String(v.id) === String(i)));

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

    const mergedVideosUnordered = [
      ...(twitchItemsWithDetails || []),
      ...(youtubeItemsWithDetails || []),
      ...currentVideos,
    ];

    const mergeVideosOrderedAndUnique = list.videos
      .map((item) => mergedVideosUnordered.find((video) => String(video.id) === String(item)))
      .filter((i) => i);

    //Filtered out the video Ids that have been removed from Twitch/Youtube
    const newFilteredIdsList = mergeVideosOrderedAndUnique.map((v) => parseNumberAndString(v.id));
    if (newFilteredIdsList.length !== list.videos.length) {
      setTimeout(async () => {
        await aiofeedAPI.updateSavedList(list.id, { videos: newFilteredIdsList });
      }, 10000);
    }
    return mergeVideosOrderedAndUnique;
  }
};

const List = ({
  list,
  ytExistsAndValidated,
  twitchExistsAndValidated,
  setLists,
  setVideos,
  videos,
}) => {
  const [dragSelected, setDragSelected] = useState();
  const { videoElementsAmount, feedVideoSizeProps } = useContext(CenterContext) || {};
  const listVideosRefs = useRef([]);

  const [videosToShow, setVideosToShow] = useState({
    amount: videoElementsAmount,
    timeout: 750,
    transitionGroup: 'videos',
  });

  useEffect(() => {
    setVideosToShow((cr) => ({
      amount: cr?.showAll && videos?.length ? videos?.length : videoElementsAmount,
      timeout: 750,
      transitionGroup: 'videos',
      showAll: cr?.showAll,
    }));
  }, [videoElementsAmount, videos]);

  useEffect(() => {
    (async () => {
      if (
        list.videos?.some(
          (i) => !listVideosRefs.current?.find((v) => String(i) === String(v.id) && !v.loading)
        )
      ) {
        const allVideos = await fetchListVideos({
          list,
          ytExistsAndValidated,
          twitchExistsAndValidated,
          // currentVideos: listVideosRefs.current,
        });

        setVideos((curr) => {
          return allVideos?.map((vid) => {
            const found = curr?.find((c) => c.id === vid.id);
            if (!found && Boolean(curr?.length))
              return { ...vid, transition: feedVideoSizeProps.transition || 'videoFadeSlide' };
            return vid;
          });
        });
        listVideosRefs.current = allVideos;
        return;
      }
      const mergeVideosOrderedAndUnique = list.videos
        .map((item) => listVideosRefs.current?.find((video) => String(video.id) === String(item)))
        .filter((i) => i);

      setTimeout(() => {
        setVideos(mergeVideosOrderedAndUnique);
        listVideosRefs.current = mergeVideosOrderedAndUnique;
      }, 0);
    })();
  }, [
    list,
    ytExistsAndValidated,
    twitchExistsAndValidated,
    feedVideoSizeProps.transition,
    setVideos,
  ]);

  const dragEvents = useMemo(
    () => ({
      draggable: true,
      setDragSelected: setDragSelected,
      dragSelected: dragSelected,
      onDragEnd: (e) => uploadNewList(e, list.id, videos, setLists),
      // onDrop: (e) => uploadNewList(e, list.name, videos, setLists),
      // onDragStart: (e) => (e.dataTransfer.effectAllowed = 'all'),
      onDragOver: (e) => restructureVideoList(e, dragSelected, setVideos),
      onDragEnter: (e) => e.preventDefault(),
    }),
    [dragSelected, setVideos, videos, list.id, setLists]
  );

  return (
    <VideosContainer>
      <TransitionGroup component={null} className={videosToShow.transitionGroup || 'videos'}>
        {videos?.slice(0, videosToShow.amount).map((video) => (
          <CSSTransition
            key={`${list.title}-${video.contentDetails?.upload?.videoId || video.id}`}
            timeout={videosToShow.timeout}
            classNames={video.transition || 'fade-750ms'}
            unmountOnExit
          >
            {video.loading ? (
              <LoadingVideoElement type={'small'} />
            ) : video?.kind === 'youtube#video' ? (
              <YoutubeVideoElement
                listName={list.title}
                list={list}
                //data-id used for dragEvents
                data-id={video.contentDetails?.upload?.videoId}
                video={video}
                {...dragEvents}
              />
            ) : (
              <VodElement
                listName={list.title}
                list={list}
                //data-id used for dragEvents
                data-id={video.id}
                data={video}
                {...dragEvents}
                vodBtnDisabled={true}
              />
            )}
          </CSSTransition>
        ))}
      </TransitionGroup>
      <LoadMore
        loaded={true}
        setVideosToShow={setVideosToShow}
        videosToShow={videosToShow}
        videos={videos}
        showAll={() => {
          setVideosToShow({
            amount: videos.length,
            timeout: 750,
            transitionGroup: 'videos',
            showAll: true,
          });
        }}
      />
    </VideosContainer>
  );
};

export default List;
