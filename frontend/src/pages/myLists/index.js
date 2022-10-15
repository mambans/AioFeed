import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { HiViewList } from 'react-icons/hi';
import './MyListsTransitions.scss';
import Header, { HeaderNumberCount } from '../../components/Header';

import MyListsContext from './MyListsContext';
import List from './List';
import useYoutubeToken from '../youtube/useToken';
import MyListSmallList from './MyListSmallList';
import DropDownDrawer from './DropDownDrawer';
import { Container } from '../twitch/StyledComponents';
import { ExpandCollapseFeedButton } from '../sharedComponents/sharedStyledComponents';
import ExpandableSection from '../../components/expandableSection/ExpandableSection';
import Alert from '../../components/alert';
import Colors from '../../components/themes/Colors';
import { useRecoilValue } from 'recoil';
import { feedPreferencesAtom, useFeedPreferences } from '../../atoms/atoms';

export const useCheckForVideosAndValidateToken = ({
  lists,
  setIsLoading = () => {},
  setYtExistsAndValidated,
}) => {
  const validateYoutubeToken = useYoutubeToken();

  useEffect(() => {
    const youtubeVideoExists =
      lists &&
      Object?.values(lists)
        .filter((l) => l.enabled)
        .map((list) => list?.videos?.find((videoId) => typeof videoId === 'string'))
        .filter((i) => i)?.length;

    const youtubePromise =
      Boolean(youtubeVideoExists) &&
      validateYoutubeToken().then(() => {
        setYtExistsAndValidated(true);
        return true;
      });

    Promise.allSettled([youtubePromise])
      .catch((e) => console.log(e))
      .finally(() => setIsLoading(false));
  }, [lists, setIsLoading, validateYoutubeToken, setYtExistsAndValidated]);
};

const FavoriteListContainer = ({
  list,
  setLists,
  ytExistsAndValidated,
  isLoading,
  fetchMyListContextData,
  className,
  savedVideosWithData,
  addSavedData,
}) => {
  const [videos, setVideos] = useState();
  const { toggleExpanded } = useFeedPreferences();
  const feedPreferences = useRecoilValue(feedPreferencesAtom);

  return (
    <Container
      aria-labelledby={`MyList-${list.id}`}
      order={feedPreferences?.[list.id]?.order || 500}
      id={'MyListsHeader-' + list.id}
    >
      <Header
        id={list.title}
        title={
          <h1 id={`MyList-${list.id}`} onClick={() => toggleExpanded(list.id)}>
            {list.title}
            <HeaderNumberCount text={list?.videos?.length} />
            <HiViewList size={25} color={Colors.green} />
            <ExpandCollapseFeedButton collapsed={feedPreferences?.[list.id]?.collapsed} />
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
      <ExpandableSection collapsed={feedPreferences?.[list.id]?.collapsed}>
        <List
          list={list}
          ytExistsAndValidated={ytExistsAndValidated}
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
  // const validateToken = useToken();
  // const validateYoutubeToken = useYoutubeToken();
  useCheckForVideosAndValidateToken({
    lists,
    setIsLoading,
    setYtExistsAndValidated,
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

export default MyLists;
