import React, { useContext, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { HiViewList } from 'react-icons/hi';
import './MyListsTransitions.scss';
import Header, { HeaderNumberCount } from '../../components/Header';

import MyListsContext from './MyListsContext';
import List from './List';
import MyListSmallList from './MyListSmallList';
import DropDownDrawer from './DropDownDrawer';
import { Container } from '../twitch/StyledComponents';
import { ExpandCollapseFeedButton } from '../sharedComponents/sharedStyledComponents';
import ExpandableSection from '../../components/expandableSection/ExpandableSection';
import Alert from '../../components/alert';
import Colors from '../../components/themes/Colors';
import { useRecoilValue } from 'recoil';
import { feedPreferencesAtom, useFeedPreferences } from '../../atoms/atoms';

const FavoriteListContainer = ({
  list,
  setLists,
  fetchMyListContextData,
  className,
  savedVideosWithData,
  addSavedData,
}) => {
  const [videos, setVideos] = useState();
  const [loading, setLoading] = useState();
  const { toggleExpanded } = useFeedPreferences();
  const feedPreferences = useRecoilValue(feedPreferencesAtom);
  const { isLoading } = useContext(MyListsContext);

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
        isLoading={isLoading || loading}
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
          setLists={setLists}
          setVideos={setVideos}
          videos={videos}
          savedVideosWithData={savedVideosWithData}
          addSavedData={addSavedData}
          setLoading={setLoading}
          isLoading={loading}
        />
      </ExpandableSection>
    </Container>
  );
};

export const MyLists = () => {
  const { lists, setLists, fetchMyListContextData, savedVideosWithData, addSavedData } =
    useContext(MyListsContext);
  // const validateToken = useToken();
  // const validateYoutubeToken = useYoutubeToken();

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
                  fetchMyListContextData={fetchMyListContextData}
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
