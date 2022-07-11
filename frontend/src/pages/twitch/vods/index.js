import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { Button } from 'react-bootstrap';

import getFollowedVods from './GetFollowedVods';
import VodElement from './VodElement';
import LoadMore from '../../../components/loadMore/LoadMore';
import { SubFeedContainer } from './../../sharedComponents/sharedStyledComponents';
import Header from './Header';
import VodsContext from './VodsContext';
import LoadingBoxes from './../LoadingBoxes';
import FeedsContext from '../../feed/FeedsContext';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import FeedsCenterContainer, { CenterContext } from './../../feed/FeedsCenterContainer';
import { Container } from '../StyledComponents';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import useToken, { TwitchContext } from '../useToken';
import ExpandableSection from '../../../components/expandableSection/ExpandableSection';
import Alert from '../../../components/alert';

const VodsStandalone = () => {
  useDocumentTitle('Twitch Vods');

  return (
    <FeedsCenterContainer left={false} right={false}>
      <Vods className='feed' />
    </FeedsCenterContainer>
  );
};

export const Vods = ({ className }) => {
  const { vods, setVods, channels, fetchVodsContextData } = useContext(VodsContext);
  const { setEnableTwitchVods, orders, toggleExpanded } = useContext(FeedsContext) || {};
  const { videoElementsAmount } = useContext(CenterContext);
  const { twitchAccessToken, setTwitchAccessToken, setTwitchRefreshToken, twitchUserId } =
    useContext(TwitchContext);
  const validateToken = useToken();
  const [error, setError] = useState(null);
  const [vodError, setVodError] = useState(null);
  const [vodAmounts, setVodAmounts] = useState({
    amount: videoElementsAmount,
    timeout: 750,
    transitionGroup: 'videos',
  });
  const refreshBtnRef = useRef();

  useEventListenerMemo('focus', windowFocusHandler);

  const refresh = useCallback(
    async (forceRefresh) => {
      refreshBtnRef?.current?.setIsLoading(true);
      if (forceRefresh) {
        await fetchVodsContextData();
      }
      getFollowedVods({
        forceRun: forceRefresh,
        setTwitchRefreshToken,
        setTwitchAccessToken,
        channels,
        currentVods: vods,
      }).then((data) => {
        setError(data?.er);
        setVodError(data?.vodError);

        refreshBtnRef?.current?.setIsLoading(false);
        if (data?.data) setVods(data.data);
        // return data.data;
      });
    },
    [setTwitchAccessToken, setTwitchRefreshToken, setVods, vods, channels, fetchVodsContextData]
  );

  async function windowFocusHandler() {
    refresh(false);
  }

  useEffect(() => {
    (async () => {
      if (validateToken) {
        refreshBtnRef?.current?.setIsLoading(true);
        setVods((c) => {
          getFollowedVods({
            forceRun: false,
            setTwitchRefreshToken,
            setTwitchAccessToken,
            channels,
            currentVods: c,
          }).then((data) => {
            setError(data.er);
            setVodError(data.vodError);

            refreshBtnRef?.current?.setIsLoading(false);
            if (data?.data) setVods(data.data);
            // return data.data;
          });
        });
      }
    })();
  }, [twitchUserId, setTwitchAccessToken, setTwitchRefreshToken, setVods, channels, validateToken]);

  useEffect(() => {
    setVodAmounts({
      amount: videoElementsAmount,
      timeout: 750,
      transitionGroup: 'videos',
    });
  }, [videoElementsAmount]);

  return (
    <Container aria-labelledby='vods' order={orders?.['vods']?.order} className={className}>
      <Header
        ref={refreshBtnRef}
        refresh={refresh}
        vods={vods}
        vodError={vodError}
        collapsed={orders?.['vods']?.collapsed}
        toggleExpanded={() => toggleExpanded('vods')}
      />
      <ExpandableSection collapsed={orders?.['vods']?.collapsed}>
        {!twitchAccessToken && (
          <Alert
            title='Not authenticated/connected with Twitch.'
            message='No access token for twitch availible.'
          />
        )}
        {error && (
          <Alert
            data={error}
            actions={
              <Button variant='danger' onClick={() => setEnableTwitchVods(false)}>
                Disable vods
              </Button>
            }
            fill
          />
        )}
        {!vods?.data ? (
          <SubFeedContainer>
            <LoadingBoxes amount={videoElementsAmount} type='small' />
          </SubFeedContainer>
        ) : (
          <>
            <TransitionGroup
              className={vodAmounts.transitionGroup || 'videos'}
              component={SubFeedContainer}
            >
              {vods.data?.slice(0, vodAmounts.amount).map((vod) => (
                <CSSTransition
                  key={vod.id}
                  timeout={vodAmounts.timeout}
                  classNames={vod.transition || 'fade-750ms'}
                  unmountOnExit
                >
                  <VodElement data={vod} />
                </CSSTransition>
              ))}
            </TransitionGroup>
            <LoadMore
              loaded={true}
              setVideosToShow={setVodAmounts}
              videosToShow={vodAmounts}
              videos={vods.data}
            />
          </>
        )}
      </ExpandableSection>
    </Container>
  );
};
export default VodsStandalone;
