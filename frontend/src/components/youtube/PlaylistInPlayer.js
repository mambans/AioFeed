import React, { useContext, useEffect, useMemo, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { useCheckForVideosAndValidateToken } from '../favorites';
import { restructureVideoList, uploadNewList } from '../favorites/dragDropUtils';
import FavoritesContext, { FavoritesProvider } from '../favorites/FavoritesContext';
import { fetchListVideos } from '../favorites/List';
import { LoadingVideoElement } from '../twitch/StyledComponents';
import VodElement from '../twitch/vods/VodElement';
import YoutubeVideoElement from './YoutubeVideoElement';

const Container = styled.div`
  height: calc(100% - 60px);
  width: 100%;
  display: flex;
  overflow: hidden scroll;
  flex-flow: row wrap;
  justify-content: center;
`;

const ListTitle = styled.h2`
  text-align: center;
  height: 50px;
`;

const List = ({ videos, list, setLists, setVideos }) => {
  const [dragSelected, setDragSelected] = useState();

  const dragEvents = useMemo(
    () => ({
      draggable: true,
      setDragSelected: setDragSelected,
      dragSelected: dragSelected,
      onDragEnd: (e) => uploadNewList(e, list.name, videos, setLists),
      // onDrop: (e) => uploadNewList(e, list.name, videos, setLists),
      onDragOver: (e) => restructureVideoList(e, videos, dragSelected, setVideos),
    }),
    [dragSelected, videos, list.name, setLists, setVideos]
  );

  return (
    <TransitionGroup component={null} className={'videos'}>
      {videos?.map((video) => (
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
              listName={list.name}
              data-id={video.contentDetails?.upload?.videoId}
              video={video}
              disableContextProvider={true}
              {...dragEvents}
            />
          ) : (
            <VodElement
              listName={list.name}
              data-id={video.id}
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

export default ({ listName }) => (
  <FavoritesProvider>
    <PlayerVideoList listName={listName} />
  </FavoritesProvider>
);

const PlayerVideoList = ({ listName }) => {
  const { lists, setLists } = useContext(FavoritesContext);
  const [ytExistsAndValidated, setYtExistsAndValidated] = useState(false);
  const [twitchExistsAndValidated, setTwitchExistsAndValidated] = useState(false);
  const [videos, setVideos] = useState();
  const list =
    lists[Object.keys(lists).find((key) => key.toLowerCase() === listName?.toLowerCase())];

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

      setVideos(allVideos);
    })();
  }, [list, listName, ytExistsAndValidated, twitchExistsAndValidated]);

  return (
    <>
      <ListTitle>{listName}</ListTitle>
      <Container>
        <List videos={videos} list={list} setLists={setLists} setVideos={setVideos} />
      </Container>
    </>
  );
};
