import React, { useContext, useEffect, useRef, useState } from 'react';
import AddVideoExtraData from '../twitch/AddVideoExtraData';
import API from '../twitch/API';
import VodElement from '../twitch/vods/VodElement';
import YoutubeVideoElement from '../youtube/YoutubeVideoElement';
import GetVideoInfo from './GetVideoInfo';
import { VideosContainer } from './StyledComponents';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { StyledLoadingBox } from '../twitch/StyledComponents';
import { durationToDate } from '../twitch/TwitchUtils';
import { LoadMore } from '../sharedStyledComponents';
import { CenterContext } from '../feed/FeedsCenterContainer';

export default ({ list, ytExistsAndValidated, twitchExistsAndValidated }) => {
  const [videos, setVideos] = useState();
  const { videoElementsAmount } = useContext(CenterContext);
  const resetVideosToShowTimer = useRef();
  const resetTransitionTimer = useRef();

  const [videosToShow, setVideosToShow] = useState({
    amount: videoElementsAmount,
    timeout: 750,
    transitionGroup: 'videos',
  });

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

        setVideos(mergeVideosOrdered);
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
        text={videosToShow.amount >= videos?.length ? 'Show less (reset)' : 'Show more'}
        onClick={() => {
          if (videosToShow.amount >= videos?.length) {
            setVideosToShow({
              amount: videoElementsAmount,
              timeout: 0,
              transitionGroup: 'instant-disappear',
            });

            clearTimeout(resetTransitionTimer.current);
            resetTransitionTimer.current = setTimeout(() => {
              setVideosToShow({
                amount: videoElementsAmount,
                timeout: 750,
                transitionGroup: 'videos',
              });
            }, 750);
          } else {
            setVideosToShow((curr) => ({
              amount: curr.amount + videoElementsAmount,
              timeout: 750,
              transitionGroup: 'videos',
            }));
          }
          clearTimeout(resetVideosToShowTimer.current);
        }}
        resetFunc={() => {
          setVideosToShow({
            amount: videoElementsAmount,
            timeout: 0,
            transitionGroup: 'instant-disappear',
          });
          clearTimeout(resetTransitionTimer.current);
          resetTransitionTimer.current = setTimeout(() => {
            setVideosToShow({
              amount: videoElementsAmount,
              timeout: 750,
              transitionGroup: 'videos',
            });
          }, 750);
        }}
      />
    </VideosContainer>
  );
};
