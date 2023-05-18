import React, { useContext, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { HiViewList } from 'react-icons/hi';
import './MyListsTransitions.scss';
import Header, { HeaderNumberCount } from '../../components/Header';

import MyListsContext from './MyListsContext';
import List from './List';
import MyListSmallList from './MyListSmallList';
import { Container } from '../twitch/StyledComponents';
import { ExpandCollapseFeedButton } from '../sharedComponents/sharedStyledComponents';
import ExpandableSection from '../../components/expandableSection/ExpandableSection';
import Alert from '../../components/alert';
import Colors from '../../components/themes/Colors';
import { useRecoilValue } from 'recoil';
import { feedPreferencesAtom, useFeedPreferences } from '../../atoms/atoms';
import { AiFillEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import DeleteListBtn from './DeleteListBtn';
import CopyListBtn from './CopyListBtn';
import { MdEdit } from 'react-icons/md';
import styled from 'styled-components';
import { ButtonLookalikeStyle } from '../../components/styledComponents';
import DropDown from '../navigation/DropDown';

const FavoriteListContainer = ({
  list,
  setLists,
  fetchMyListContextData,
  className,
  savedVideosWithData,
  addSavedData,
}) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState();
  const { toggleExpanded } = useFeedPreferences();
  const feedPreferences = useRecoilValue(feedPreferencesAtom);
  const { isLoading, toggleList } = useContext(MyListsContext);

  console.log('p loading:', loading);
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
            <DropDown
              showArrow={false}
              trigger={
                <TriggerBtn>
                  <MdEdit size={24} />
                </TriggerBtn>
              }
              items={[
                {
                  title: list.enabled ? 'Visible' : 'Hidden',
                  icon: list.enabled ? (
                    <AiFillEye size={22} color='#ffffff' />
                  ) : (
                    <AiOutlineEyeInvisible size={22} color='rgb(150,150,150)' />
                  ),
                  onClick: () => toggleList(list.id),
                },
              ]}
            >
              <CopyListBtn list={list} />
              <DeleteListBtn list={list} />

              {/* <ListActionButton onClick={() => toggleList(list.id)}>
                {list.enabled ? (
                  <>
                    <AiFillEye size={22} color='#ffffff' />
                    Visible
                  </>
                ) : (
                  <>
                    <AiOutlineEyeInvisible size={22} color='rgb(150,150,150)' />
                    Hidden
                  </>
                )}
              </ListActionButton> */}
            </DropDown>
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
          loading={loading}
          collapsed={feedPreferences?.[list.id]?.collapsed}
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

const TriggerBtn = styled.button`
  ${ButtonLookalikeStyle}
  /* color: ${({ open }) => (open ? 'rgb(255, 255, 255)' : 'rgb(150, 150, 150)')};
  width: ${({ open }) => (open ? '100px' : '36px')}; */
  transition: color 250ms, width 250ms;
  padding: 5px;
  padding-left: ${({ open }) => (open ? '10px' : '5px')};
  background: ${({ open }) =>
    open ? 'var(--popupListsBackground)' : 'var(--refreshButtonBackground)'};
  text-align: left;
`;
