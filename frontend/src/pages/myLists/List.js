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
import { restructureVideoList, uploadNewList } from './dragDropUtils';
// import aiofeedAPI from '../navigation/API';
import { VideosContainer } from '../../components/styledComponents';
import addVideoDataToVideos from './addVideoDataToVideos';

export const fetchListVideos = async ({ list, currentVideos = [], videos }) => {
  if (videos || list?.videos) {
    const twitchFetchVideos = async (items) => {
      const fetchedVideos = await TwitchAPI.getVideos({ id: items }).catch((e) => {});

      if (!fetchedVideos) return false;

      const finallFetchedVideos = await AddVideoExtraData({
        items: fetchedVideos.data,
        fetchGameInfo: false,
      });

      return await addVodEndTime(finallFetchedVideos.data);
    };

    const youtubeFetchVideos = async (items) => await GetVideoInfo({ videos: items });

    const twitchItems = (videos || list.videos)
      .map((video) => typeof video === 'number' && video)
      .filter((i) => i);

    const youtubeItems = (videos || list.videos)
      .map((video) => typeof video === 'string' && video)
      .filter((i) => i && !currentVideos.find((v) => String(v.id) === String(i)));

    const twitchItemsWithDetails = Boolean(twitchItems?.length)
      ? await twitchFetchVideos(twitchItems)
      : twitchItems?.map((video) => ({ id: video, loading: true }));

    const youtubeItemsWithDetails = Boolean(youtubeItems?.length)
      ? await youtubeFetchVideos(youtubeItems)
      : youtubeItems.map((video) => {
          return { id: video, contentDetails: { upload: { videoId: video } }, loading: true };
        });

    const mergedVideosUnordered = [
      ...(twitchItemsWithDetails || []),
      ...(youtubeItemsWithDetails || []),
      ...currentVideos,
    ];

    const mergeVideosOrderedAndUnique = (videos || list?.videos)
      .map((item) => ({
        ...mergedVideosUnordered.find((video) => String(video?.id) === String(item)),
        list_id: list?.id,
      }))
      .filter((i) => i);

    //Filtered out the video Ids that have been removed from Twitch/Youtube
    // const newFilteredIdsList = mergeVideosOrderedAndUnique
    //   .map((v) => parseNumberAndString(v.id))
    //   .filter((i) => i);

    // console.log('\n');
    // console.log('list.title:', list.title);
    // console.log('twitchItems:', twitchItems);
    // console.log('youtubeItems:', youtubeItems);
    // console.log('twitchItemsWithDetails:', twitchItemsWithDetails);
    // console.log('youtubeItemsWithDetails:', youtubeItemsWithDetails);
    // console.log('mergedVideosUnordered:', mergedVideosUnordered);
    // console.log('mergeVideosOrderedAndUnique:', mergeVideosOrderedAndUnique);
    // console.log('newFilteredIdsList:', newFilteredIdsList);
    // console.log('videos || list.videos:', videos || list.videos);
    // console.log('\n');
    // if (newFilteredIdsList.length < (videos || list.videos).length) {
    //   setTimeout(async () => {
    //     await aiofeedAPI.updateSavedList(list.id, { videos: newFilteredIdsList });
    //   }, 10000);
    // }
    return mergeVideosOrderedAndUnique;
  }
};

const List = ({
  list,
  setLists,
  setVideos,
  videos,
  savedVideosWithData,
  addSavedData,
  setLoading,
}) => {
  const [dragSelected, setDragSelected] = useState();
  const { videoElementsAmount } = useContext(CenterContext) || {};

  const [videosToShow, setVideosToShow] = useState({
    amount: videoElementsAmount / 2,
    timeout: 750,
    transitionGroup: 'videos',
  });
  const loadMoreRef = useRef();

  // useEffect(() => {
  //   setVideosToShow((cr) => ({
  //     amount: cr?.showAll && videos?.length ? videos?.length : videoElementsAmount / 2,
  //     timeout: 750,
  //     transitionGroup: 'videos',
  //     showAll: cr?.showAll,
  //   }));
  // }, [videoElementsAmount, videos]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const videosWithData = await addVideoDataToVideos({
        savedVideosWithData: savedVideosWithData.current,
        list,
        videos: list?.videos.slice(
          0,
          (videosToShow?.showAll && list?.videos?.length) || videosToShow?.amount
        ),
      });
      console.log('videosWithData:', videosWithData);
      loadMoreRef.current?.setLoading?.(false);

      const invalidVideos = list?.videos
        .slice(0, (videosToShow?.showAll && list?.videos?.length) || videosToShow?.amount)
        .map((id) => {
          return !videosWithData.find((v) => String(v.id) === String(id));
        });
      console.log('invalidVideos:', invalidVideos);

      setLoading(false);
      setVideos((c) => videosWithData);
      addSavedData(videosWithData);
    })();
  }, [
    list,
    setVideos,
    savedVideosWithData,
    addSavedData,
    setLoading,
    videosToShow?.amount,
    videosToShow?.showAll,
  ]);

  const dragEvents = useMemo(
    () => ({
      draggable: true,
      setDragSelected: setDragSelected,
      dragSelected: dragSelected,
      onDragEnd: (e) => uploadNewList(e, list.id, videos, setLists),
      // onDrop: (e) => uploadNewList(e, list.name, videos, setLists),
      // onDragStart: (e) => (e.dataTransfer.effectAllowed = 'all'),
      onDragOver: (e) => {
        // e.preventDefault();
        restructureVideoList(e, dragSelected, setVideos);
      },
      onDragEnter: (e) => e.preventDefault(),
    }),
    [dragSelected, setVideos, videos, list.id, setLists]
  );

  return (
    <VideosContainer onDragOver={(e) => e.preventDefault()}>
      <TransitionGroup component={null} className={videosToShow.transitionGroup || 'videos'}>
        {(videosToShow?.showAll ? videos : videos?.slice(0, videosToShow.amount))?.map((video) => (
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
      {!!list?.videos?.length && (
        <LoadMore
          ref={loadMoreRef}
          onClick={() => {
            loadMoreRef.current?.setLoading?.(true);
            setVideosToShow((curr) => ({
              amount: curr.amount + videoElementsAmount,
              timeout: 750,
              transitionGroup: 'videos',
            }));
          }}
          onReset={() => {
            setVideosToShow((curr) => ({
              amount: videoElementsAmount / 2,
              timeout: 750,
              transitionGroup: 'videos',
              //transitionGroup: 'instant-disappear',
            }));
            /*clearTimeout(resetTransitionTimer.current);
            resetTransitionTimer.current = setTimeout(() => {
              setVideosToShow((curr) => ({
                amount: curr.amount,
                timeout: 750,
                transitionGroup: 'videos',
              }));
            }, 750);*/
          }}
          reachedEnd={videosToShow?.amount >= list?.videos?.length}
          onShowAll={() => {
            setVideosToShow({
              amount: list?.videos?.length,
              timeout: 750,
              transitionGroup: 'videos',
              showAll: true,
            });
          }}
        />
      )}
    </VideosContainer>
  );
};

export default List;
