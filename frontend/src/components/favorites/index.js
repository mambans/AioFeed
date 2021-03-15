import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';

import './FavoritesTransitions.scss';
import { HeaderContainer } from '../sharedStyledComponents';
import DeleteListBtn from './DeleteListBtn';
import FavoritesContext, { FavoritesProvider } from './FavoritesContext';
import FeedsCenterContainer from '../feed/FeedsCenterContainer';
import List from './List';
import { VodsProvider } from '../twitch/vods/VodsContext';
import useToken from '../twitch/useToken';
import useYoutubeToken from '../youtube/useToken';
import AlertHandler from '../alert';
import AddNewVideoInput from './AddNewVideoInput';

export const useCheckForVideosAndValidateToken = ({
  lists,
  setIsLoading = () => {},
  setYtExistsAndValidated,
  setTwitchExistsAndValidated,
}) => {
  const validateToken = useToken();
  const validateYoutubeToken = useYoutubeToken();

  useEffect(() => {
    const youtubeVideoExists = Object?.values(lists)
      .map((list) => list?.items?.find((videoId) => typeof videoId === 'string'))
      .filter((i) => i)?.length;

    const twitchVideoExists = Object?.values(lists)
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

export default () => (
  <VodsProvider>
    <FavoritesProvider>
      <FeedsCenterContainer fullWidth={true}>
        <Favorites />
      </FeedsCenterContainer>
    </FavoritesProvider>
  </VodsProvider>
);

const StyledFavoriteListContainer = styled.div`
  width: 100%;
`;

export const FavoriteListContainer = ({
  list,
  setLists,
  ytExistsAndValidated,
  twitchExistsAndValidated,
  isLoading,
  fetchAllLists,
}) => {
  const [videos, setVideos] = useState();

  return (
    <StyledFavoriteListContainer>
      <HeaderContainer
        id={list.name}
        text={<>{list.name}</>}
        refreshFunc={fetchAllLists}
        isLoading={isLoading}
        onHoverIconLink='favorites'
        rightSide={
          <>
            <AddNewVideoInput list={list} videos={videos} listName={list.name} />
            <DeleteListBtn list={list} setLists={setLists} style={{ margin: '0 10px' }} />
          </>
        }
      />
      <List
        list={list}
        ytExistsAndValidated={ytExistsAndValidated}
        twitchExistsAndValidated={twitchExistsAndValidated}
        setLists={setLists}
        setVideos={setVideos}
        videos={videos}
      />
    </StyledFavoriteListContainer>
  );
};

export const Favorites = () => {
  const { lists, setLists, fetchAllLists, isLoading, setIsLoading } = useContext(FavoritesContext);
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
          {Object.values(lists)?.map((list) => (
            <CSSTransition
              key={list.name}
              timeout={1000}
              classNames='listHorizontalSlide'
              unmountOnExit
            >
              <FavoriteListContainer
                list={list}
                setLists={setLists}
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
          title="You haven't created any 'Favorites' list."
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
