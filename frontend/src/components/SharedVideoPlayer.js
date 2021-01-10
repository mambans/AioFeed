import { MdVerticalAlignBottom } from 'react-icons/md';
import { FaList } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState, useCallback } from 'react';

import {
  VideoAndChatContainer,
  ShowNavbarBtn,
  ResizeDevider,
  VolumeEventOverlay,
  PlayerExtraButtons,
} from './twitch/player/StyledComponents';
import NavigationContext from './navigation/NavigationContext';
import AddVideoButton from './favorites/addRemoveButton/AddVideoButton';
import useQuery from './../hooks/useQuery';
import PlaylistInPlayer from './youtube/PlaylistInPlayer';
import useSyncedLocalState from '../hooks/useSyncedLocalState';

const DEFAULT_LIST_WIDTH = Math.max(window.innerWidth * 0.1, 400);

export default ({ children }) => {
  const videoId = useParams().videoId;
  const { visible, setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);
  const listName = useQuery().get('list') || useQuery().get('listName') || null;
  const [viewStates, setViewStates] = useSyncedLocalState(`${listName}-viewStates`, {
    listWidth: DEFAULT_LIST_WIDTH,
    hideList: false,
    default: true,
  });
  const [resizeActive, setResizeActive] = useState(false);

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

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    setShrinkNavbar('true');
    setVisible(false);
    setFooterVisible(false);

    return () => {
      document.documentElement.style.overflow = 'visible';
      setShrinkNavbar('false');
      setFooterVisible(true);
      setVisible(true);
    };
  }, [setShrinkNavbar, setFooterVisible, setVisible]);

  return (
    <>
      <VideoAndChatContainer
        id='twitch-embed'
        visible={visible}
        chatwidth={viewStates.listWidth || DEFAULT_LIST_WIDTH}
        resizeActive={resizeActive}
        hidechat={viewStates.hideList || !listName}
        onMouseUp={handleResizeMouseUp}
        onMouseMove={resize}
      >
        <AddVideoButton
          videoId_p={videoId}
          style={{ left: '15px', top: '55px', opacity: '1' }}
          size={32}
        />
        <PlayerExtraButtons>
          <ShowNavbarBtn variant='dark' onClick={() => setVisible(!visible)} style={{ right: '0' }}>
            <MdVerticalAlignBottom
              style={{
                transform: visible ? 'rotateX(180deg)' : 'unset',
              }}
              size={26}
              title='Show navbar'
            />
            Nav
          </ShowNavbarBtn>
          <ShowNavbarBtn
            variant='dark'
            disabled={!listName}
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
        </PlayerExtraButtons>
        <VolumeEventOverlay
          show={resizeActive}
          type='live'
          id='controls'
          hidechat={String(viewStates.hideList)}
          chatwidth={viewStates.listWidth || DEFAULT_LIST_WIDTH}
        />

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
              <PlaylistInPlayer listName={listName} />
            </div>
          </>
        )}
        {children}
      </VideoAndChatContainer>
    </>
  );
};
