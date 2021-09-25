import { FaList } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useState, useCallback, useRef } from 'react';

import {
  VideoAndChatContainer,
  ShowNavbarBtn,
  ResizeDevider,
  // VolumeEventOverlay,
  PlayerExtraButtons,
} from '../twitch/player/StyledComponents';
import NavigationContext from '../navigation/NavigationContext';
import AddToListButton from '../myLists/addToListModal/AddToListButton';
import useQuery from '../../hooks/useQuery';
import PlaylistInPlayer from '../youtube/PlaylistInPlayer';
import useSyncedLocalState from '../../hooks/useSyncedLocalState';
import YoutubeVideoPlayer from '../youtube/YoutubeVideoPlayer';
import VideoPlayer from '../twitch/player/VideoPlayer';
import useFullscreen from '../../hooks/useFullscreen';
import MyListsContext from '../myLists/MyListsContext';
import autoPlayNextFunc from '../myLists/autoPlayNext';
import useLocalStorageState from '../../hooks/useLocalStorageState';
import VolumeEventOverlay from '../twitch/VolumeEventOverlay';
import { TwitchContext } from '../twitch/useToken';

const DEFAULT_LIST_WIDTH = Math.max(window.innerWidth * 0.1, 400);

const SharedVideoPlayerDefault = () => {
  const list_p = useQuery().get('list');
  const listName_p = useQuery().get('listName');
  const [listName, setListName] = useState(list_p || listName_p);

  return <SharedVideoPlayer listName={listName} setListName={setListName} />;
};

const SharedVideoPlayer = ({ listName, setListName }) => {
  const location = useLocation();
  const { videoId } = useParams() || {};
  const channelName = useParams()?.channelName;
  const { visible } = useContext(NavigationContext);
  const { enableVodVolumeOverlay } = useContext(TwitchContext) || {};
  const { lists } = useContext(MyListsContext) || {};
  const [viewStates, setViewStates] = useSyncedLocalState(`${listName}-viewStates`, {
    listWidth: DEFAULT_LIST_WIDTH,
    hideList: false,
    default: true,
  });
  const [resizeActive, setResizeActive] = useState(false);
  const [listVideos, setListVideos] = useState();
  const [autoPlayNext, setAutoPlayNext] = useLocalStorageState('autoPlayNext');
  const [loopList, setLoopList] = useLocalStorageState('loopList');
  const [autoPlayRandom, setAutoPlayRandom] = useLocalStorageState('autoPlayRandom');
  const navigate = useNavigate();
  const list =
    lists && lists[Object.keys(lists).find((key) => key.toLowerCase() === listName?.toLowerCase())];
  const domain = location.pathname.split('/')[1];
  const VolumeEventOverlayRef = useRef();
  const [isPlaying, setIsPlaying] = useState();
  const childPlayer = useRef();
  const videoElementRef = useRef();
  const [playQueue, setPlayQueue] = useState([]);

  useFullscreen();

  const handleResizeMouseDown = () => setResizeActive(true);
  const handleResizeMouseUp = (e) => setResizeActive(false);
  const resize = useCallback(
    (e) => {
      if (resizeActive) {
        const mouseX = e.clientX;

        const newWidth = Math.min(
          Math.max(parseInt(window.innerWidth - mouseX), 10),
          window.innerWidth - 250
        );

        setViewStates((curr) => {
          delete curr?.default;
          return { ...curr, listWidth: newWidth };
        });
      }
    },
    [resizeActive, setViewStates]
  );

  const playNext = () => {
    const nextVideoUrl = autoPlayNextFunc({
      listVideos,
      videoId,
      list,
      listName,
      autoPlayNext,
      loopList,
      autoPlayRandom,
      playQueue,
      setPlayQueue,
    });
    if (nextVideoUrl) navigate(nextVideoUrl);
  };

  return (
    <>
      <VideoAndChatContainer
        id='twitch-embed'
        ref={videoElementRef}
        visible={visible}
        chatwidth={viewStates.listWidth || DEFAULT_LIST_WIDTH}
        resizeActive={resizeActive}
        hidechat={viewStates.hideList || !listName}
        onMouseUp={handleResizeMouseUp}
        onMouseMove={resize}
      >
        <AddToListButton
          videoId_p={videoId}
          style={{
            right: listName && !viewStates.hideList ? `${viewStates.listWidth + 15}px` : '15px',
            top: '55px',
            // opacity: '1',
          }}
          size={32}
          list={list}
          setListName={setListName}
          redirect
        />
        <PlayerExtraButtons channelName={channelName}>
          {listName && (
            <ShowNavbarBtn
              variant='dark'
              onClick={() => {
                setViewStates((curr) => {
                  const newValue = !curr.hideList;
                  delete curr?.default;

                  return { ...curr, hideList: newValue };
                });
              }}
            >
              <FaList
                style={{
                  transform: visible ? 'rotateX(180deg)' : 'unset',
                  right: '10px',
                }}
                size={30}
                title='Show list'
              />
              List
            </ShowNavbarBtn>
          )}
        </PlayerExtraButtons>
        <VolumeEventOverlay
          ref={VolumeEventOverlayRef}
          show={resizeActive || (enableVodVolumeOverlay && isPlaying)}
          type='live'
          id='controls'
          hidechat={String(viewStates.hideList || !listName)}
          vodVolumeOverlayEnabled={enableVodVolumeOverlay}
          chatwidth={viewStates.listWidth || DEFAULT_LIST_WIDTH}
          showcursor={enableVodVolumeOverlay && isPlaying}
          isPlaying={isPlaying}
          resizeActive={resizeActive}
          viewStates={viewStates}
          listName={listName}
          DEFAULT_LIST_WIDTH={DEFAULT_LIST_WIDTH}
          VolumeEventOverlayRef={VolumeEventOverlayRef}
          player={childPlayer}
          setIsPlaying={setIsPlaying}
          videoElementRef={videoElementRef}
          visiblyShowOnHover
          showVolumeText
          addEventListeners
        />

        {domain === 'youtube' ? (
          <YoutubeVideoPlayer playNext={playNext} />
        ) : (
          <VideoPlayer
            listIsOpen={listName && !viewStates.hideList}
            listWidth={viewStates.listWidth}
            playNext={playNext}
            VolumeEventOverlayRef={VolumeEventOverlayRef}
            setIsPlaying={setIsPlaying}
            childPlayer={childPlayer}
          />
        )}
        {/* {children} */}

        {!viewStates.hideList && listName && (
          <>
            <ResizeDevider
              onMouseDown={handleResizeMouseDown}
              resizeActive={resizeActive}
              chatwidth={viewStates.listWidth}
            >
              <div />
            </ResizeDevider>
            <div id='chat'>
              <PlaylistInPlayer
                listName={listName}
                listVideos={listVideos}
                setListVideos={setListVideos}
                videoId={videoId}
                setAutoPlayNext={setAutoPlayNext}
                autoPlayNext={autoPlayNext}
                loopList={loopList}
                setLoopList={setLoopList}
                autoPlayRandom={autoPlayRandom}
                setAutoPlayRandom={setAutoPlayRandom}
                playQueue={playQueue}
                setPlayQueue={setPlayQueue}
                playNext={playNext}
              />
            </div>
          </>
        )}
      </VideoAndChatContainer>
    </>
  );
};

export default SharedVideoPlayerDefault;
