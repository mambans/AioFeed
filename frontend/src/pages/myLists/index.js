import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { HiViewList } from 'react-icons/hi';
import './MyListsTransitions.scss';
import Header, { HeaderNumberCount } from '../../components/Header';

import MyListsContext from './MyListsContext';
import FeedsCenterContainer from '../feed/FeedsCenterContainer';
import List from './List';
import useToken from '../twitch/useToken';
import useYoutubeToken from '../youtube/useToken';
import MyListSmallList from './MyListSmallList';
import DropDownDrawer from './DropDownDrawer';
import { Container } from '../twitch/StyledComponents';
import useDocumentTitle from './../../hooks/useDocumentTitle';
import FeedsContext from '../feed/FeedsContext';
import { ExpandCollapseFeedButton } from '../sharedComponents/sharedStyledComponents';
import ExpandableSection from '../../components/expandableSection/ExpandableSection';
import Alert from '../../components/alert';

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
        .filter((l) => l.enabled)
        .map((list) => list?.videos?.find((videoId) => typeof videoId === 'string'))
        .filter((i) => i)?.length;

    const twitchVideoExists =
      lists &&
      Object?.values(lists)
        .filter((l) => l.enabled)
        .map((list) => list?.videos?.find((videoId) => typeof videoId === 'number'))
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
  fetchMyListContextData,
  className,
  savedVideosWithData,
  addSavedData,
}) => {
  const [videos, setVideos] = useState();
  const { orders, toggleExpanded } = useContext(FeedsContext);

  return (
    <Container
      aria-labelledby={`MyList-${list.id}`}
      order={orders?.[list.id]?.order}
      id={'MyListsHeader-' + list.id}
    >
      <Header
        id={list.title}
        title={
          <h1 id={`MyList-${list.id}`} onClick={() => toggleExpanded(list.id)}>
            {list.title}
            <HeaderNumberCount text={list?.videos?.length} />
            <HiViewList size={25} color={'var(--listColorAdd)'} />
            <ExpandCollapseFeedButton collapsed={orders?.[list.id]?.collapsed} />
          </h1>
        }
        refresh={fetchMyListContextData}
        isLoading={isLoading}
        rightSide={
          <>
            <MyListSmallList list={list} videos={videos} listName={list.title} />
            <DropDownDrawer list={list} />
          </>
        }
      />
      <ExpandableSection collapsed={orders?.[list.id]?.collapsed}>
        <List
          list={list}
          ytExistsAndValidated={ytExistsAndValidated}
          twitchExistsAndValidated={twitchExistsAndValidated}
          setLists={setLists}
          setVideos={setVideos}
          videos={videos}
          savedVideosWithData={savedVideosWithData}
          addSavedData={addSavedData}
        />
      </ExpandableSection>
    </Container>
  );
};

export const MyLists = () => {
  const {
    lists,
    setLists,
    fetchMyListContextData,
    isLoading,
    setIsLoading,
    savedVideosWithData,
    addSavedData,
  } = useContext(MyListsContext);
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
      {Boolean(Object.values(lists).length) ? (
        <TransitionGroup component={null}>
          {Object.values(lists)
            .filter((list) => list.enabled)
            ?.map((list) => (
              <CSSTransition
                key={'mylist- ' + list.id}
                timeout={1000}
                classNames='listHorizontalSlide'
                unmountOnExit
                appear
              >
                <FavoriteListContainer
                  list={list}
                  setLists={setLists}
                  isLoading={isLoading}
                  fetchMyListContextData={fetchMyListContextData}
                  ytExistsAndValidated={ytExistsAndValidated}
                  twitchExistsAndValidated={twitchExistsAndValidated}
                  savedVideosWithData={savedVideosWithData}
                  addSavedData={addSavedData}
                />
              </CSSTransition>
            ))}
        </TransitionGroup>
      ) : (
        <Alert
          type='secondary'
          title='No custom lists avaliable'
          message='Create your first "custtom list" in the sidebar'
          dismissible
          fill
        />
      )}
    </>
  );
};

export default MylistsContainer;
