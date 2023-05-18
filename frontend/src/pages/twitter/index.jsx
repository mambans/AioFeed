import { Alert } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { useCallback, useContext, useRef } from 'react';
import { MdEdit } from 'react-icons/md';

import { Container, MainContainer } from './StyledComponents';
import UpdateTwitterLists from '../navigation/sidebar/UpdateTwitterLists';
import ThemeContext from '../../components/themes/ThemeContext';
import { CenterContext } from '../feed/FeedsCenterContainer';
import Timelines from './Timelines';
import ResizeWrapper from '../../components/ResizeWrapper';
import TwitterContext from './TwitterContext';
import { useRecoilValue } from 'recoil';
import { feedPreferencesAtom } from '../../atoms/atoms';

const Twitter = () => {
  const { twitch, youtube, vods, twitter } = useRecoilValue(feedPreferencesAtom);
  const { twitterLists } = useContext(TwitterContext);
  const { activeTheme } = useContext(ThemeContext);
  const { setTwitterWidth } = useContext(CenterContext);
  const mainContainerRef = useRef();

  const pushTwitterWidthToFeed = useCallback(
    (id, width) => setTwitterWidth((c) => ({ ...c, [id]: width })),
    [setTwitterWidth]
  );

  return (
    <MainContainer
      aria-label='twitter'
      id='twitter'
      center={!twitch?.enabled && !youtube?.enabled && !vods?.enabled}
      ref={mainContainerRef}
      key={`Twitter-${activeTheme.type}`}
    >
      <TransitionGroup component={null}>
        {twitterLists?.map((id) => (
          <CSSTransition classNames='twitterList' key={id} timeout={750} unmountOnExit>
            <section aria-label={id}>
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
            </section>
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
          {twitter?.enabled && <UpdateTwitterLists style={{ padding: '10px' }} />}
        </Container>
      )}
    </MainContainer>
  );
};

const List = ({ children, width }) => {
  return <Container width={width}>{children}</Container>;
};

export default Twitter;
