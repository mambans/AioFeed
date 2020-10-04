import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './FavoritesTransitions.scss';
import { HeaderContainer } from '../sharedStyledComponents';
import DeleteListBtn from './DeleteListBtn';
import FavoritesContext from './FavoritesContext';
import FeedsCenterContainer from '../feed/FeedsCenterContainer';
import List from './List';
import validateToken from '../twitch/validateToken';
import youtubeValidateToken from '../youtube/validateToken';

export default () => {
  const { lists, setLists } = useContext(FavoritesContext);
  const [ytExistsAndValidated, setYtExistsAndValidated] = useState(false);
  const [twitchExistsAndValidated, setTwitchExistsAndValidated] = useState(false);

  useEffect(() => {
    const youtubeVideoExists = Object?.values(lists)
      .map((list) => list.items.find((videoId) => typeof videoId === 'string'))
      .filter((i) => i).length;

    const twitchVideoExists = Object?.values(lists)
      .map((list) => list.items.find((videoId) => typeof videoId === 'number'))
      .filter((i) => i).length;

    if (Boolean(youtubeVideoExists)) {
      youtubeValidateToken().then(() => setYtExistsAndValidated(true));
    }

    if (Boolean(twitchVideoExists)) {
      validateToken().then(() => setTwitchExistsAndValidated(true));
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
                <>
                  <HeaderContainer
                    text={<>{list.name}</>}
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
    </FeedsCenterContainer>
  );
};
