import { CSSTransition } from 'react-transition-group';
import React, { useContext } from 'react';

import AccountContext from './../account/AccountContext';
import AlertHandler from './../alert';
import FeedsContext from './FeedsContext';
import NoFeedsEnable from './NoFeedsEnabled';
import { Vods } from '../twitch/vods';
import { Twitter } from '../twitter';
import { Youtube } from './../youtube';
import FeedsCenterContainer from './FeedsCenterContainer';
import { Twitch } from '../twitch/live';
import { Favorites } from '../favorites';
import { FavoritesProvider } from '../favorites/FavoritesContext';

const Feed = () => {
  document.title = 'AioFeed | Feed';
  const { enableTwitch, enableYoutube, enableTwitchVods, enableFavorites } =
    useContext(FeedsContext);
  const { username } = useContext(AccountContext);

  if (!username) {
    return (
      <AlertHandler
        title='Login to continue'
        message='You are not logged with your AioFeed account.'
      />
    );
  }
  return (
    <FeedsCenterContainer>
      <NoFeedsEnable />
      <Twitter />
      <CSSTransition in={enableTwitch} classNames='fade-750ms' timeout={750} unmountOnExit appear>
        <Twitch />
      </CSSTransition>
      <FavoritesProvider>
        <CSSTransition
          in={enableYoutube}
          timeout={750}
          classNames='fade-750ms'
          unmountOnExit
          appear
        >
          <Youtube />
        </CSSTransition>

        <CSSTransition in={enableTwitchVods} classNames='fade-750ms' timeout={750} unmountOnExit>
          <Vods />
        </CSSTransition>

        <CSSTransition
          in={enableFavorites}
          timeout={750}
          classNames='fade-750ms'
          unmountOnExit
          appear
        >
          <Favorites />
        </CSSTransition>
      </FavoritesProvider>
    </FeedsCenterContainer>
  );
};

export default Feed;
