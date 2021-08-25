import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { Button } from 'react-bootstrap';

import AlertHandler from '../../alert';
import getFollowedVods from './GetFollowedVods';
import VodElement from './VodElement';
import LoadMore from './../../sharedComponents/LoadMore';
import { SubFeedContainer } from './../../sharedComponents/sharedStyledComponents';
import Header from './Header';
import AccountContext from './../../account/AccountContext';
import VodsContext from './VodsContext';
import LoadingBoxes from './../LoadingBoxes';
import FeedsContext from '../../feed/FeedsContext';
import { getCookie, getLocalstorage } from '../../../util/Utils';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import FeedsCenterContainer, { CenterContext } from './../../feed/FeedsCenterContainer';
import { Container } from '../StyledComponents';

const VodsStandalone = () => (
  <FeedsCenterContainer>
    <Vods />
  </FeedsCenterContainer>
);

export const Vods = () => {
  const { vods, setVods, channels } = useContext(VodsContext);
  const { twitchUserId, setTwitchToken, setRefreshToken } = useContext(AccountContext);
  const { setEnableTwitchVods } = useContext(FeedsContext) || {};
  const { videoElementsAmount } = useContext(CenterContext);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(getLocalstorage('FeedOrders')?.['Vods'] ?? 27);
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
      refreshBtnRef.current.setIsLoading(true);
      getFollowedVods({
        forceRun: forceRefresh,
        setRefreshToken,
        setTwitchToken,
        channels,
      })
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else if (data.vodError) {
            setVodError(data.vodError);
          }
          setVods(data.videos);
          refreshBtnRef.current.setIsLoading(false);
        })
        .catch((data) => {
          setError(data.error);

          setVods(data.videos);
        });
    },
    [setTwitchToken, setRefreshToken, setVods, channels]
  );

  async function windowFocusHandler() {
    refresh(false);
  }

  useEffect(() => {
    (async () => {
      refreshBtnRef.current.setIsLoading(true);
      getFollowedVods({
        forceRun: false,
        setRefreshToken,
        setTwitchToken,
        channels,
      })
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else if (data.vodError) {
            setVodError(data.vodError);
          }

          setVods(data.videos);
          refreshBtnRef.current.setIsLoading(false);
        })
        .catch((data) => {
          setError(data.error);
          setVods(data.videos);
        });
    })();
  }, [twitchUserId, setTwitchToken, setRefreshToken, setVods, channels]);

  useEffect(() => {
    setVodAmounts({
      amount: videoElementsAmount,
      timeout: 750,
      transitionGroup: 'videos',
    });
  }, [videoElementsAmount]);

  return (
    <Container order={order}>
      <Header
        ref={refreshBtnRef}
        refresh={refresh}
        vods={vods}
        vodError={vodError}
        setOrder={setOrder}
      />
      {!getCookie(`Twitch-access_token`) && (
        <AlertHandler
          title='Not authenticated/connected with Twitch.'
          message='No access token for twitch availible.'
        />
      )}
      {error && (
        <AlertHandler
          data={error}
          style={{ marginTop: '-150px' }}
          element={
            <Button
              style={{ margin: '0 20px' }}
              variant='danger'
              onClick={() => setEnableTwitchVods(false)}
            >
              Disable vods
            </Button>
          }
        />
      )}
      {!vods?.data ? (
        <LoadingBoxes amount={videoElementsAmount} type='small' />
      ) : (
        <>
          <TransitionGroup
            className={vodAmounts.transitionGroup || 'videos'}
            component={SubFeedContainer}
          >
            {vods.data.slice(0, vodAmounts.amount).map((vod) => (
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
    </Container>
  );
};
export default VodsStandalone;
