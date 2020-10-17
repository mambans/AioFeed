import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './FavoritesTransitions.scss';
import { HeaderContainer } from '../sharedStyledComponents';
import DeleteListBtn from './DeleteListBtn';
import FavoritesContext, { FavoritesProvider } from './FavoritesContext';
import FeedsCenterContainer from '../feed/FeedsCenterContainer';
import List from './List';
import { VodsProvider } from '../twitch/vods/VodsContext';
import useToken from '../twitch/useToken';
import useYoutubeToken from '../youtube/useToken';

export default () => (
  <VodsProvider>
    <FavoritesProvider>
      <FeedsCenterContainer fullWidth={true}>
        <Favorites />
      </FeedsCenterContainer>
    </FavoritesProvider>
  </VodsProvider>
);

export const Favorites = () => {
  const { lists, setLists, fetchAllLists, isLoading, setIsLoading } = useContext(FavoritesContext);
  const [ytExistsAndValidated, setYtExistsAndValidated] = useState(false);
  const [twitchExistsAndValidated, setTwitchExistsAndValidated] = useState(false);
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
  }, [lists, setIsLoading, validateToken, validateYoutubeToken]);

  return (
    <>
      {lists && (
        <TransitionGroup component={null}>
          {Object.values(lists)?.map((list) => {
            return (
              <CSSTransition
                key={list.name}
                timeout={1000}
                classNames='listVerticalSlide'
                unmountOnExit
              >
                <>
                  <HeaderContainer
                    id={list.name}
                    text={<>{list.name}</>}
                    refreshFunc={fetchAllLists}
                    isLoading={isLoading}
                    onHoverIconLink='favorites'
                    rightSide={<DeleteListBtn list={list} setLists={setLists} />}
                  />
                  <List
                    list={list}
                    ytExistsAndValidated={ytExistsAndValidated}
                    twitchExistsAndValidated={twitchExistsAndValidated}
                  />
                </>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      )}
    </>
  );
};
