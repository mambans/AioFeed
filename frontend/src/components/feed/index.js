import { CSSTransition } from 'react-transition-group';
import React, { useEffect, useContext } from 'react';

import { Container } from '../twitch/StyledComponents';
import AccountContext from './../account/AccountContext';
import AlertHandler from './../alert';
import FeedsContext from './FeedsContext';
import NoFeedsEnable from './NoFeedsEnabled';
import TwitchVods from '../twitch/vods';
import Twitter from '../twitter';
import Youtube from './../youtube';
import FeedsCenterContainer from './FeedsCenterContainer';
import Twitch from '../twitch/live';

export default () => {
  document.title = 'AioFeed | Feed';
  const { enableTwitch, enableYoutube, enableTwitchVods } = useContext(FeedsContext);
  const { username } = useContext(AccountContext);

  useEffect(() => {
    Notification.requestPermission().then(function (result) {
      console.log('Notifications: ', result);
    });
  }, []);

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

      <CSSTransition in={enableTwitchVods} classNames='fade-750ms' timeout={750} unmountOnExit>
        <Container>
          <TwitchVods />
        </Container>
      </CSSTransition>

      <CSSTransition in={enableYoutube} timeout={750} classNames='fade-750ms' unmountOnExit appear>
        <Container>
          <Youtube />
        </Container>
      </CSSTransition>
    </FeedsCenterContainer>
  );
};
