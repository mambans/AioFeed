import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './MyListsTransitions.scss';
import Header from '../sharedComponents/Header';

import MyListsContext from './MyListsContext';
import FeedsCenterContainer from '../feed/FeedsCenterContainer';
import List from './List';
import useToken from '../twitch/useToken';
import useYoutubeToken from '../youtube/useToken';
import AlertHandler from '../alert';
import MyListSmallList from './MyListSmallList';
import DropDownDrawer from './DropDownDrawer';
import { Container } from '../twitch/StyledComponents';
import { getLocalstorage } from '../../util';
import useDocumentTitle from './../../hooks/useDocumentTitle';

export const useCheckForVideosAndValidateToken = ({
  lists,
  setIsLoading = () => {},
  setYtExistsAndValidated,
  setTwitchExistsAndValidated,
}) => {
  const validateToken = useToken();
  const validateYoutubeToken = useYoutubeToken();

  useEffect(() => {
    const youtubeVideoExists =
      lists &&
      Object?.values(lists)
        .map((list) => list?.items?.find((videoId) => typeof videoId === 'string'))
        .filter((i) => i)?.length;

    const twitchVideoExists =
      lists &&
      Object?.values(lists)
        .map((list) => list?.items?.find((videoId) => typeof videoId === 'number'))
        .filter((i) => i)?.length;

    const twitchPromise =
      Boolean(twitchVideoExists) &&
      validateToken().then(() => {
        setTwitchExistsAndValidated(true);
        return true;
      });

    const youtubePromise =
      Boolean(youtubeVideoExists) &&
      validateYoutubeToken().then(() => {
        setYtExistsAndValidated(true);
        return true;
      });

    Promise.allSettled([twitchPromise, youtubePromise])
      .catch((e) => console.log(e))
      .finally(() => setIsLoading(false));
  }, [
    lists,
    setIsLoading,
    validateToken,
    validateYoutubeToken,
    setYtExistsAndValidated,
    setTwitchExistsAndValidated,
  ]);
};

const MylistsContainer = () => {
  useDocumentTitle('My lists');

  return (
    <FeedsCenterContainer left={false} right={false}>
      <div className='feed'>
        <MyLists />
      </div>
    </FeedsCenterContainer>
  );
};

export const FavoriteListContainer = ({
  list,
  setLists,
  ytExistsAndValidated,
  twitchExistsAndValidated,
  isLoading,
  fetchAllLists,
  index,
  className,
}) => {
  const [videos, setVideos] = useState();
  const [order, setOrder] = useState((getLocalstorage('FeedOrders')?.[list.name] ?? 26) + index);

  return (
    <Container order={order} id='MyListsHeader'>
      <Header
        id={list.name}
        text={<>{list.name}</>}
        refreshFunc={fetchAllLists}
        isLoading={isLoading}
        onHoverIconLink='nylists'
        rightSide={
          <>
            <MyListSmallList list={list} videos={videos} listName={list.name} />
            <DropDownDrawer list={list} />
          </>
        }
        setOrder={setOrder}
        feedName={list.name}
      />
      <List
        list={list}
        ytExistsAndValidated={ytExistsAndValidated}
        twitchExistsAndValidated={twitchExistsAndValidated}
        setLists={setLists}
        setVideos={setVideos}
        videos={videos}
      />
    </Container>
  );
};

export const MyLists = () => {
  const { lists, setLists, fetchAllLists, isLoading, setIsLoading } = useContext(MyListsContext);
  const [ytExistsAndValidated, setYtExistsAndValidated] = useState(false);
  const [twitchExistsAndValidated, setTwitchExistsAndValidated] = useState(false);
  // const validateToken = useToken();
  // const validateYoutubeToken = useYoutubeToken();
  useCheckForVideosAndValidateToken({
    lists,
    setIsLoading,
    setYtExistsAndValidated,
    setTwitchExistsAndValidated,
  });

  return (
    <>
      {Boolean(Object.keys(lists).length) ? (
        <TransitionGroup component={null}>
          {Object.values(lists)?.map((list, index) => (
            <CSSTransition
              key={list.name}
              timeout={1000}
              classNames='listHorizontalSlide'
              unmountOnExit
            >
              <FavoriteListContainer
                list={list}
                setLists={setLists}
                index={index}
                isLoading={isLoading}
                fetchAllLists={fetchAllLists}
                ytExistsAndValidated={ytExistsAndValidated}
                twitchExistsAndValidated={twitchExistsAndValidated}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      ) : (
        <AlertHandler
          show={true}
          type='secondary'
          title="You haven't created any custom list."
          style={{
            width: '50%',
          }}
          hideMessage={true}
          dismissible={true}
        />
      )}
    </>
  );
};

export default MylistsContainer;