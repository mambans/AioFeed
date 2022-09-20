import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { MdMovieCreation, MdLiveTv } from 'react-icons/md';
import { useParams, useLocation } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import React, { useEffect, useState, useCallback, useRef } from 'react';

import LoadMore from '../../../components/loadMore/LoadMore';
import Header from '../../../components/Header';
import { TopDataSortButtonsContainer, TopStreamsContainer, Container } from './styledComponents';
import ClipsSortButton from './../channelPage/ClipsSortButton';
import getTopClips from './GetTopClips';
import getTopStreams from './GetTopStreams';
import getTopVideos from './GetTopVideos';
import LoadingBoxes from './../LoadingBoxes';
import SortButton from './../channelPage/SortButton';
import StreamElement from './../live/StreamElement';
import ClipElement from './../channelPage/ClipElement';
import VodElement from './../vods/VodElement';
import useQuery from '../../../hooks/useQuery';
import TwitchAPI from '../API';
import TypeButton from './TypeButton';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useFavicon from '../../../hooks/useFavicon';
import { imageAspectDimensions } from '../../../util';
import GameSearchBar from '../searchbars/GameSearchBar';
import { useRecoilValue } from 'recoil';
import { feedVideoSizePropsAtom } from '../../../atoms/atoms';

const TopStreams = () => {
  const { category, type } = useParams();
  const { p_videoType } = useLocation().state || {};
  const [topData, setTopData] = useState([]);
  const [gameInfo, setGameInfo] = useState({ name: category });
  const URLQueries = useQuery();
  const [videoType, setVideoType] = useState(
    type || URLQueries.get('type')?.toLowerCase() || p_videoType || 'streams'
  );
  const feedVideoSizeProps = useRecoilValue(feedVideoSizePropsAtom);

  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('Views');
  const [sortByTime, setSortByTime] = useState(
    parseInt(URLQueries.get('within')?.toLowerCase()) || null
  );
  const oldTopData = useRef();
  const refreshBtnRef = useRef();
  useDocumentTitle(
    `${gameInfo?.name || category || 'All'} - ${
      videoType.charAt(0).toUpperCase() + videoType.slice(1)
    }`
  );
  useFavicon(gameInfo?.box_art_url?.replace('{width}', 130)?.replace('{height}', 173));

  const VideoElementTypeComp = ({ data }) => {
    switch (videoType) {
      case 'streams':
        return <StreamElement data={data} size='small' />;
      case 'clips':
        return <ClipElement data={data} size='small' />;
      case 'videos':
        return <VodElement data={data} size='small' />;
      default:
        return <StreamElement data={data} size='small' />;
    }
  };

  const fetchVideosDataHandler = (res, shouldLoadMore, setLoading) => {
    if (shouldLoadMore) {
      const allTopData = oldTopData.current.data.concat(res?.topData?.data);
      oldTopData.current = {
        data: allTopData,
        pagination: res?.topData?.pagination,
      };

      setLoading(false);
      setTopData(allTopData);
    } else {
      oldTopData.current = res?.topData;
      setTopData(res?.topData?.data);
      refreshBtnRef?.current?.setIsLoading(false);
    }
  };

  const fetchVideos = useCallback(
    (shouldLoadMore, setLoading) => {
      setError(null);
      if (shouldLoadMore) setLoading(true);

      switch (videoType) {
        case 'streams':
          getTopStreams(category, shouldLoadMore && oldTopData.current, feedVideoSizeProps)
            .then((res) => fetchVideosDataHandler(res, shouldLoadMore, setLoading))
            .catch((e) => {
              if (e?.message === 'game is undefined') {
                setError('Invalid game name');
              } else {
                setError(typeof e === 'string' ? e : e.message);
              }
              refreshBtnRef?.current?.setIsLoading(false);
            });
          break;
        case 'clips':
          getTopClips(category, sortByTime, oldTopData.current, feedVideoSizeProps)
            .then((res) => fetchVideosDataHandler(res, shouldLoadMore, setLoading))
            .catch((e) => {
              console.log('e:', e);
              if (e?.message === 'game is undefined') {
                setError('Invalid game name');
              } else {
                setError(typeof e === 'string' ? e : e.message);
              }
              refreshBtnRef?.current?.setIsLoading(false);
            });
          break;
        case 'videos':
          getTopVideos(category, sortBy, oldTopData.current, feedVideoSizeProps)
            .then((res) => fetchVideosDataHandler(res, shouldLoadMore, setLoading))
            .catch((e) => {
              if (e?.message === 'game is undefined') {
                setError('Invalid game name');
              } else {
                setError(typeof e === 'string' ? e : e.message);
              }
              refreshBtnRef?.current?.setIsLoading(false);
            });
          break;
        default:
          getTopStreams(category, shouldLoadMore && oldTopData.current, feedVideoSizeProps)
            .then((res) => fetchVideosDataHandler(res, shouldLoadMore, setLoading))
            .catch((e) => {
              if (e?.message === 'game is undefined') {
                setError('Invalid game name');
              } else {
                setError(typeof e === 'string' ? e : e.message);
              }
              refreshBtnRef?.current?.setIsLoading(false);
            });
      }
    },
    [category, sortBy, sortByTime, videoType, feedVideoSizeProps]
  );

  const refresh = useCallback(() => {
    refreshBtnRef?.current?.setIsLoading(true);
    oldTopData.current = null;
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    (async () => {
      const gameInfo = await TwitchAPI.getGames({ name: category }).then((res) => res.data.data[0]);
      console.log('gameInfo:', gameInfo);
      setGameInfo(gameInfo);
    })();
  }, [category]);

  useEffect(() => {
    refreshBtnRef?.current?.setIsLoading(true);
    setTopData([]);
    fetchVideos();
  }, [fetchVideos]);

  return (
    <CSSTransition in={true} timeout={750} classNames='fade-750ms' appear>
      <Container>
        <Header
          ref={refreshBtnRef}
          title={
            <h1>
              {gameInfo?.box_art_url ? (
                <img
                  src={gameInfo?.box_art_url?.replace('{width}', 130)?.replace('{height}', 173)}
                  alt=''
                  style={{
                    ...imageAspectDimensions({ height: 80, ar: 3 / 4 }),
                    alignSelf: 'end',
                  }}
                />
              ) : (
                <div
                  className='imgPlaceholder'
                  style={{
                    ...imageAspectDimensions({ height: 80, ar: 3 / 4 }),
                    alignSelf: 'end',
                  }}
                />
              )}
              <div style={{ alignSelf: 'end', textAlign: 'start', fontSize: '0.95em' }}>
                <p style={{ textTransform: 'capitalize' }}>{gameInfo?.name || 'Top'}</p>
                <span style={{ textTransform: 'capitalize', fontSize: '0.85em' }}>
                  {videoType}
                  {!videoType || videoType === 'streams' ? (
                    <MdLiveTv size={25} />
                  ) : (
                    <MdMovieCreation size={25} />
                  )}
                </span>
              </div>
            </h1>
          }
          refresh={refresh}
          rightSide={
            <TopDataSortButtonsContainer>
              <GameSearchBar placeholder={category} videoType={videoType} />
              <TypeButton
                category={category}
                videoType={videoType}
                setSortBy={setSortBy}
                setTopData={setTopData}
                oldTopData={oldTopData}
                setVideoType={setVideoType}
              />

              {videoType === 'videos' ? (
                <SortButton sortBy={sortBy} setSortBy={setSortBy} setData={setTopData} />
              ) : videoType === 'clips' ? (
                <ClipsSortButton
                  sortBy={sortByTime}
                  setSortBy={setSortByTime}
                  setData={setTopData}
                  resetOldData={() => {
                    oldTopData.current = null;
                  }}
                />
              ) : null}
            </TopDataSortButtonsContainer>
          }
        ></Header>

        {error ? (
          <Alert
            variant='warning'
            style={{ textAlign: 'center', width: '25%', margin: 'auto' }}
            dismissible
            onClose={() => setError(null)}
          >
            <Alert.Heading>{error}</Alert.Heading>
          </Alert>
        ) : (
          <TopStreamsContainer>
            <>
              <LoadingBoxes
                amount={Math.floor(
                  ((window.innerWidth - 150) / feedVideoSizeProps?.totalWidth) * 1.5
                )}
                load={!topData || topData.length <= 0}
                type='big'
              />

              <TransitionGroup className='twitch-top-live' component={null}>
                {topData?.map((stream) => (
                  <CSSTransition
                    key={stream.id}
                    timeout={{
                      appear: 500,
                      enter: 500,
                      exit: 0,
                    }}
                    classNames='fade-750ms'
                    unmountOnExit
                  >
                    <VideoElementTypeComp data={stream} />
                  </CSSTransition>
                ))}
              </TransitionGroup>

              <LoadMore text='Load more' show={topData?.length} onClick={fetchVideos} />
            </>
          </TopStreamsContainer>
        )}
      </Container>
    </CSSTransition>
  );
};
export default TopStreams;
