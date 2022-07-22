import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled, { css } from 'styled-components';
import { MdQueuePlayNext, MdSkipNext } from 'react-icons/md';
import { CgScrollV } from 'react-icons/cg';
import { HiViewList } from 'react-icons/hi';
import { FaRandom } from 'react-icons/fa';
import { TiArrowLoop } from 'react-icons/ti';

import { useCheckForVideosAndValidateToken } from '.';
import MyListSmallList from './MyListSmallList';
import { restructureVideoList, uploadNewList } from './dragDropUtils';
import MyListsContext from './MyListsContext';
import { LoadingVideoElement } from '../twitch/StyledComponents';
import VodElement from '../twitch/vods/VodElement';
import YoutubeVideoElement from '../youtube/YoutubeVideoElement';
import ToolTip from '../../components/tooltip/ToolTip';
import { useParams } from 'react-router';
import { ListItem } from './StyledComponents';
import NewListForm from './addToListModal/NewListForm';
import useClicksOutside from '../../hooks/useClicksOutside';
import { TransparentButton } from '../../components/styledComponents';
import addVideoDataToVideos from './addVideoDataToVideos';

const Container = styled.div`
  max-height: calc(100% - 60px);
  width: 100%;
  display: flex;
  overflow: hidden scroll;
  flex-flow: row wrap;
  justify-content: center;
  padding-bottom: 75px;
  padding-top: 10px;
  overflow: auto;
`;

const PlayListButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 10px;
  position: relative;
`;

const ListTitle = styled.h2`
  height: 50px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  position: relative;
`;

const svgButtonsStyle = ({ enabled }) => css`
  cursor: pointer;
  opacity: ${enabled === 'true' ? '1' : '0.3'};
  transition: opacity 250ms;

  &:hover {
    opacity: ${enabled === 'true' ? '1' : '0.6'};
  }
`;

const PlayNextBtn = styled(MdSkipNext)`
  ${svgButtonsStyle}
  opacity: 0.7;
  transition: opacity 250ms;

  &:hover {
    opacity: 1;
  }
`;
const ShowListsBtn = styled(HiViewList)`
  ${svgButtonsStyle}
`;
const ListsList = styled.div`
  position: absolute;
  background: rgba(20, 20, 20, 0.92);
  left: 500;
  top: 0;
  border-radius: 3px;
  min-width: 125px;
  min-height: 50px;
  padding: 15px;
  z-index: 3;
`;

const AutoPlayNextBtn = styled(MdQueuePlayNext)`
  ${svgButtonsStyle}
`;
const ScrollToVideoBtn = styled(CgScrollV)`
  ${svgButtonsStyle}
`;
const LoopListBtn = styled(TiArrowLoop)`
  ${svgButtonsStyle}
`;

const PlayNextRandomBtn = styled(FaRandom)`
  ${svgButtonsStyle}
`;

export const ShowLists = ({ setListToShow, listToShow, setLists, lists = {} }) => {
  const [open, setOpen] = useState();
  const { videoId } = useParams() || {};
  const ref = useRef();
  useClicksOutside(ref, () => setOpen(false), open);
  const handleToggle = () => setOpen((c) => !c);

  return (
    <div ref={ref} style={{ height: '20px', display: 'flex' }}>
      <ShowListsBtn size={20} onClick={handleToggle} />
      <CSSTransition in={open} timeout={500} classNames='SlideHorizontal' unmountOnExit>
        <ListsList>
          {Object?.values(lists)?.map((list, index) => {
            return (
              <ListItem
                key={list?.title + index}
                added={list?.videos?.includes(videoId)}
                style={{ height: '45px', fontSize: '1.1em' }}
              >
                <TransparentButton
                  onClick={() => {
                    if (listToShow?.title !== list.title) setListToShow(list);
                  }}
                >
                  {list.title}
                </TransparentButton>
              </ListItem>
            );
          })}
          <NewListForm item={videoId} style={{ marginTop: '25px' }} />
        </ListsList>
      </CSSTransition>
    </div>
  );
};

const List = ({ listVideos, list, setLists, setListVideos, videoId, playQueue, setPlayQueue }) => {
  const [dragSelected, setDragSelected] = useState();

  const dragEvents = useMemo(
    () => ({
      draggable: true,
      setDragSelected: setDragSelected,
      dragSelected: dragSelected,
      onDragEnd: (e) => uploadNewList(e, list?.id, listVideos, setLists),
      // onDrop: (e) => uploadNewList(e, list.name, videos, setLists),
      onDragOver: (e) => restructureVideoList(e, dragSelected, setListVideos),
      onDragEnter: (e) => e.preventDefault(),
    }),
    [dragSelected, listVideos, list?.id, setLists, setListVideos]
  );

  console.log('listVideos:', listVideos);
  return (
    <TransitionGroup component={null}>
      {listVideos?.map((video) => (
        <CSSTransition
          key={`${list.title}-${video.contentDetails?.upload?.videoId || video.id}`}
          timeout={750}
          classNames={video.list_id !== list.id ? 'fade-750ms' : 'verticalSlide'}
          // classNames='videoFadeSlide'
          unmountOnExit
        >
          {video.loading ? (
            <LoadingVideoElement type={'small'} />
          ) : video?.kind === 'youtube#video' ? (
            <YoutubeVideoElement
              active={String(video.contentDetails?.upload?.videoId) === videoId}
              listName={list.title}
              list={list}
              id={`v${video.contentDetails?.upload?.videoId}`}
              // data-id={video.contentDetails?.upload?.videoId}
              video={video}
              {...dragEvents}
              setPlayQueue={setPlayQueue}
              playQueue={playQueue}
              data-id={video.contentDetails?.upload?.videoId}
            />
          ) : (
            <VodElement
              active={String(video.id) === videoId}
              listName={list.title}
              list={list}
              id={`v${video.id}`}
              // data-id={video.id}
              data={video}
              {...dragEvents}
              setPlayQueue={setPlayQueue}
              playQueue={playQueue}
              data-id={video.id}
            />
          )}
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

const PlaylistInPlayer = ({
  listName,
  listVideos,
  setListVideos,
  videoId,
  setAutoPlayNext,
  autoPlayNext,
  loopList,
  setLoopList,
  autoPlayRandom,
  setAutoPlayRandom,
  playQueue,
  setPlayQueue,
  playNext,
  list,
  setListToShow,
}) => {
  const { setLists, lists, savedVideosWithData, addSavedData } = useContext(MyListsContext);
  const [ytExistsAndValidated, setYtExistsAndValidated] = useState(false);
  const [twitchExistsAndValidated, setTwitchExistsAndValidated] = useState(false);
  const [search, setSearch] = useState();
  const checkIncludes = useCallback(
    (values) => values.some((v) => String(v)?.toLowerCase()?.includes(search?.toLowerCase())),
    [search]
  );
  // eslint-disable-next-line no-unused-vars
  const videos = useMemo(
    () =>
      listVideos?.filter(({ id, login, user_name, title, snippet } = {}) =>
        !search
          ? listVideos
          : checkIncludes([
              id,
              login,
              user_name,
              title,
              snippet?.title,
              snippet?.channelTitle,
              snippet?.channelId,
            ])
      ),
    [listVideos, search, checkIncludes]
  );

  useCheckForVideosAndValidateToken({
    lists,
    setYtExistsAndValidated,
    setTwitchExistsAndValidated,
  });

  const handleOnSearchFilter = (v) => {
    setSearch(v);
  };

  useEffect(() => {
    (async () => {
      const videos = await addVideoDataToVideos({
        savedVideosWithData: savedVideosWithData.current,
        list,
        ytExistsAndValidated,
        twitchExistsAndValidated,
      });

      setListVideos((curr) =>
        videos.map((vid) => {
          if (curr?.find((c) => c.id === vid.id)) {
            return { ...vid, transition: 'verticalSlide' };
          }
          return vid;
        })
      );
      addSavedData(videos);
    })();
  }, [
    list,
    listName,
    ytExistsAndValidated,
    twitchExistsAndValidated,
    setListVideos,
    savedVideosWithData,
    addSavedData,
  ]);

  useEffect(() => {
    const ele = document.querySelector(`#v${videoId}`);

    if (ele) {
      setTimeout(
        () => ele.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }),
        0
      );
    }
  }, [videoId]);

  return (
    <>
      <ListTitle>{list?.title}</ListTitle>
      <PlayListButtonsContainer>
        <ToolTip tooltip='Show and switch between lists' width='max-content'>
          <ShowLists
            setListToShow={setListToShow}
            listToShow={list}
            setLists={setLists}
            lists={lists}
          />
        </ToolTip>
        <ToolTip
          tooltip={`${autoPlayNext ? 'Disable' : 'Enable'} auto play next video.`}
          width='max-content'
        >
          <AutoPlayNextBtn
            size={20}
            onClick={() => setAutoPlayNext((c) => !c)}
            enabled={String(autoPlayNext)}
          />
        </ToolTip>
        <ToolTip tooltip={`${autoPlayNext ? 'Disable' : 'Enable'} loop list.`}>
          <LoopListBtn
            size={20}
            onClick={() => setLoopList((c) => !c)}
            enabled={String(loopList)}
          />
        </ToolTip>
        <ToolTip
          tooltip={`${autoPlayNext ? 'Disable' : 'Enable'} randomise next video.`}
          width='max-content'
        >
          <PlayNextRandomBtn
            size={20}
            onClick={() => setAutoPlayRandom((c) => !c)}
            enabled={String(autoPlayRandom)}
          />
        </ToolTip>

        <ToolTip tooltip={'play next video in queue/list'} width='max-content'>
          <PlayNextBtn size={20} onClick={playNext} />
        </ToolTip>
        <ToolTip tooltip={'Scroll to video'} width='max-content'>
          <ScrollToVideoBtn
            onClick={() => {
              const ele = document.querySelector(`#v${videoId}`);
              if (ele && listVideos) {
                ele.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
              }
            }}
          />
        </ToolTip>
      </PlayListButtonsContainer>
      <MyListSmallList
        list={list}
        listName={listName}
        videos={listVideos}
        style={{ width: '87%', margin: '0 auto', position: 'relative' }}
        onChange={handleOnSearchFilter}
      />
      <Container>
        {list && (
          <List
            listVideos={listVideos}
            list={list}
            setListVideos={setListVideos}
            videoId={videoId}
            setPlayQueue={setPlayQueue}
            playQueue={playQueue}
            setLists={setLists}
          />
        )}
      </Container>
    </>
  );
};

export default PlaylistInPlayer;
