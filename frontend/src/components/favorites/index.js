import React, { useContext, useEffect, useState } from 'react';
import FeedsCenterContainer from '../feed/FeedsCenterContainer';
import { HeaderContainer } from '../sharedStyledComponents';
import List from './List';
import FavoritesContext from './FavoritesContext';

import DeleteListBtn from './DeleteListBtn';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './FavoritesTransitions.scss';
import youtubeValidateToken from '../youtube/validateToken';
import validateToken from '../twitch/validateToken';

export default () => {
  const { lists, setLists } = useContext(FavoritesContext);
  const [ytExistsAndValidated, setYtExistsAndValidated] = useState(false);
  const [twitchExistsAndValidated, setTwitchExistsAndValidated] = useState(false);

  useEffect(() => {
    const youtubeVideoExists =
      lists &&
      Object.values(lists)
        .map((list) => {
          return list.items.find((videoId) => typeof videoId === 'string');
        })
        .filter((i) => i).length;

    const twitchVideoExists =
      lists &&
      Object.values(lists)
        .map((list) => {
          return list.items.find((videoId) => typeof videoId === 'number');
        })
        .filter((i) => i).length;

    if (youtubeVideoExists) {
      youtubeValidateToken().then(() => {
        setYtExistsAndValidated(true);
      });
    }

    if (twitchVideoExists) {
      validateToken().then(() => {
        setTwitchExistsAndValidated(true);
      });
    }
  }, [lists]);

  return (
    <FeedsCenterContainer fullWidth={true}>
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
                <HeaderContainer
                  text={<>{list.name}</>}
                  rightSide={<DeleteListBtn list={list} setLists={setLists} />}
                />
                <List
                  list={list}
                  ytExistsAndValidated={ytExistsAndValidated}
                  twitchExistsAndValidated={twitchExistsAndValidated}
                />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      )}
    </FeedsCenterContainer>
  );
};
