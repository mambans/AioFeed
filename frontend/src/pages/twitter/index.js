import { Alert } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { useCallback, useContext, useRef } from 'react';
import { MdEdit } from 'react-icons/md';

import { Container, MainContainer } from './StyledComponents';
import FeedsContext from '../feed/FeedsContext';
import UpdateTwitterLists from '../navigation/sidebar/UpdateTwitterLists';
import ThemeContext from './../../components/themes/ThemeContext';
import FeedsCenterContainer, { CenterContext } from '../feed/FeedsCenterContainer';
import Timelines from './Timelines';
import ResizeWrapper from '../../components/ResizeWrapper';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import TwitterContext from './TwitterContext';

const TwitterStandalone = () => {
  useDocumentTitle('Twitter');
  return (
    <FeedsCenterContainer left={false} right={false}>
      <Twitter in={true} />
    </FeedsCenterContainer>
  );
};

export const Twitter = ({ in: forceMount = false }) => {
  const { enableTwitter, enableTwitch, enableYoutube, enableTwitchVods } = useContext(FeedsContext);
  const { twitterLists } = useContext(TwitterContext);
  const { activeTheme } = useContext(ThemeContext);
  const { setTwitterWidth } = useContext(CenterContext);
  const mainContainerRef = useRef();

  const pushTwitterWidthToFeed = useCallback(
    (id, width) => setTwitterWidth((c) => ({ ...c, [id]: width })),
    [setTwitterWidth]
  );

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
        id='twitter'
        center={forceMount || (!enableTwitch && !enableYoutube && !enableTwitchVods)}
        ref={mainContainerRef}
      >
        <TransitionGroup component={null}>
          {twitterLists?.map((id) => (
            <CSSTransition classNames='twitterList' key={id} timeout={750} unmountOnExit>
              <div>
                <ResizeWrapper parentCallbackWidth={pushTwitterWidthToFeed}>
                  <List key={id} id={id}>
                    <a
                      title={`Edit list ${id} at Twitter.com`}
                      id='editLink'
                      target='_blank'
                      rel='noopener noreferrer'
                      href={`https://twitter.com/i/lists/${id}`}
                    >
                      <MdEdit size={14} />
                    </a>
                    <Timelines id={id} mainContainerRef={mainContainerRef} />
                  </List>
                </ResizeWrapper>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>

        {!Boolean(twitterLists?.length) && (
          <Container key={'No feed'}>
            <Alert variant='info' style={{ textAlign: 'center' }}>
              <Alert.Heading>No Twitter list ID entered</Alert.Heading>
              <hr />
              Please enter a public twitter list id below.
            </Alert>
            {(enableTwitter || forceMount) && <UpdateTwitterLists style={{ padding: '10px' }} />}
          </Container>
        )}
      </MainContainer>
    </CSSTransition>
  );
};

const List = ({ children, width }) => {
  return <Container width={width}>{children}</Container>;
};

export default TwitterStandalone;
