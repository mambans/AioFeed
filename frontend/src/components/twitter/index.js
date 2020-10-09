import { Alert } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import React, { useContext } from 'react';

import { Container, LoadingPlaceholder, MainContainer } from './StyledComponents';
import FeedsContext from '../feed/FeedsContext';
import UpdateTwitterLists from '../navigation/sidebar/UpdateTwitterLists';
import ThemeContext from './../themes/ThemeContext';
import FooterContext from '../footer/FooterContext';
import FeedsCenterContainer from '../feed/FeedsCenterContainer';

export default () => (
  <FeedsCenterContainer>
    <Twitter in={true} />
  </FeedsCenterContainer>
);

export const Twitter = ({ in: forceMount = false }) => {
  const { twitterLists, enableTwitter, enableTwitch, enableYoutube, enableTwitchVods } = useContext(
    FeedsContext
  );
  const { activeTheme } = useContext(ThemeContext);
  const { footerVisibleInViewport } = useContext(FooterContext);

  return (
    <CSSTransition
      in={enableTwitter || forceMount}
      timeout={750}
      classNames='twitter-slide'
      unmountOnExit
      key={`Twitter-${activeTheme.type}`}
      appear={true}
    >
      <MainContainer
        footerVisibleInViewport={footerVisibleInViewport}
        id='twitter'
        center={forceMount || (!enableTwitch && !enableYoutube && !enableTwitchVods)}
      >
        <TransitionGroup component={null}>
          {twitterLists?.map((id) => {
            return (
              <CSSTransition classNames='twitterList' key={id} timeout={750} unmountOnExit>
                <Container key={id} footerVisibleInViewport={footerVisibleInViewport}>
                  <TwitterTimelineEmbed
                    sourceType='list'
                    id={id}
                    placeholder={<LoadingPlaceholder />}
                    autoHeight={true}
                    theme={activeTheme.type}
                    noScrollbar={true}
                    noHeader={true}
                    noFooter={true}
                    noBorders={true}
                    transparent={true}
                    onLoad={() => {
                      console.log(`Twitter list '${id}' loaded.`);
                    }}
                  />
                </Container>
              </CSSTransition>
            );
          })}
        </TransitionGroup>

        {!Boolean(twitterLists?.length) && (
          <Container key={'No feed'} footerVisibleInViewport={footerVisibleInViewport}>
            <Alert variant='info' style={{ textAlign: 'center' }}>
              <Alert.Heading>No Twitter list ID entered</Alert.Heading>
              <hr />
              Please enter a public twitter list id below.
            </Alert>
            <UpdateTwitterLists style={{ padding: '10px' }} />
          </Container>
        )}
      </MainContainer>
    </CSSTransition>
  );
};
