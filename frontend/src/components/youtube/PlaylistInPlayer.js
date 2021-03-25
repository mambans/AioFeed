import React, { useContext, useEffect, useMemo, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { MdQueuePlayNext } from 'react-icons/md';

import { useCheckForVideosAndValidateToken } from '../favorites';
import AddNewVideoInput from '../favorites/AddNewVideoInput';
import { restructureVideoList, uploadNewList } from '../favorites/dragDropUtils';
import FavoritesContext from '../favorites/FavoritesContext';
import { fetchListVideos } from '../favorites/List';
import { LoadingVideoElement } from '../twitch/StyledComponents';
import VodElement from '../twitch/vods/VodElement';
import YoutubeVideoElement from './YoutubeVideoElement';
import ToolTip from '../ToolTip';

const Container = styled.div`
  height: calc(100% - 60px);
  width: 100%;
  display: flex;
  overflow: hidden scroll;
  flex-flow: row wrap;
  justify-content: center;
  padding-bottom: 50px;
  padding-top: 10px;
`;

const ListTitle = styled.h2`
  height: 50px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  position: relative;
`;

const AutoPlayNextBtn = styled(MdQueuePlayNext)`
  position: absolute;
  margin: 0 15px;
  left: 0;
  transform: translateY(25%);
  cursor: pointer;
  opacity: ${({ enabled }) => (enabled === 'true' ? '1' : '0.3')};
  transition: opacity 250ms;

  &:hover {
    opacity: ${({ enabled }) => (enabled === 'true' ? '1' : '0.6')};
  }
`;

const List = ({ listVideos, list, setLists, setListVideos, videoId }) => {
  const [dragSelected, setDragSelected] = useState();

  const dragEvents = useMemo(
    () => ({
      draggable: true,
      setDragSelected: setDragSelected,
      dragSelected: dragSelected,
      onDragEnd: (e) => uploadNewList(e, list.name, listVideos, setLists),
      // onDrop: (e) => uploadNewList(e, list.name, videos, setLists),
      onDragOver: (e) => restructureVideoList(e, listVideos, dragSelected, setListVideos),
    }),
    [dragSelected, listVideos, list.name, setLists, setListVideos]
  );

  return (
    <TransitionGroup component={null} className={'videos'}>
      {listVideos?.map((video) => (
        <CSSTransition
          key={`${list.name}-${video.contentDetails?.upload?.videoId || video.id}`}
          timeout={750}
          classNames={video.transition || 'fade-750ms'}
          // classNames='videoFadeSlide'
          unmountOnExit
        >
          {video.loading ? (
            <LoadingVideoElement type={'small'} />
          ) : video?.kind === 'youtube#video' ? (
            <YoutubeVideoElement
              active={String(video.contentDetails?.upload?.videoId) === videoId}
              listName={list.name}
              id={'v' + video.contentDetails?.upload?.videoId}
              data-id={'v' + video.contentDetails?.upload?.videoId}
              video={video}
              disableContextProvider={true}
              {...dragEvents}
            />
          ) : (
            <VodElement
              active={String(video.id) === videoId}
              listName={list.name}
              id={'v' + video.id}
              data-id={'v' + video.id}
              data={video}
              disableContextProvider={true}
              {...dragEvents}
            />
          )}
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

export default ({
  listName,
  listVideos,
  setListVideos,
  videoId,
  setAutoPlayNext,
  autoPlayNext,
}) => {
  const { lists, setLists } = useContext(FavoritesContext) || {};
  const [ytExistsAndValidated, setYtExistsAndValidated] = useState(false);
  const [twitchExistsAndValidated, setTwitchExistsAndValidated] = useState(false);
  // const [videos, setVideos] = useState();
  const list =
    lists && lists[Object.keys(lists).find((key) => key.toLowerCase() === listName?.toLowerCase())];

  useCheckForVideosAndValidateToken({
    lists,
    setYtExistsAndValidated,
    setTwitchExistsAndValidated,
  });

  useEffect(() => {
    (async () => {
      const allVideos = await fetchListVideos({
        list,
        ytExistsAndValidated,
        twitchExistsAndValidated,
      });

      setListVideos(allVideos);
    })();
  }, [list, listName, ytExistsAndValidated, twitchExistsAndValidated, setListVideos]);

  useEffect(() => {
    const ele = document.querySelector(`#v${videoId}`);

    if (ele && listVideos) {
      setTimeout(
        () => ele.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }),
        0
      );
    }
  }, [videoId, listVideos]);

  return (
    <>
      <ListTitle>
        <ToolTip tooltip={`${autoPlayNext ? 'Disable' : 'Enable'} auto play next video.`}>
          <AutoPlayNextBtn
            size={20}
            onClick={() => setAutoPlayNext((c) => !c)}
            enabled={String(autoPlayNext)}
          />
        </ToolTip>
        {listName}
      </ListTitle>
      <AddNewVideoInput
        list={list}
        listName={listName}
        videos={listVideos}
        style={{ width: '87%', margin: '0 auto' }}
      />
      <Container>
        <List
          listVideos={listVideos}
          list={list}
          setLists={setLists}
          setListVideos={setListVideos}
          videoId={videoId}
        />
      </Container>
    </>
  );
};
