import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { debounce } from 'lodash';

import AlertHandler from '../../alert';
import getFollowedVods from './GetFollowedVods';
import VodElement from './VodElement';
import { SubFeedContainer, LoadMore } from './../../sharedStyledComponents';
import Header from './Header';
import AccountContext from './../../account/AccountContext';
import VodsContext, { VodsProvider } from './VodsContext';
import LoadingBoxes from './../LoadingBoxes';
import FeedsContext from '../../feed/FeedsContext';
import { AddCookie, getCookie } from '../../../util/Utils';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import FeedsCenterContainer, { CenterContext } from './../../feed/FeedsCenterContainer';
import useToken from '../useToken';

export default ({ disableContextProvider }) => (
  <FeedsCenterContainer>
    <VodsProvider>
      <Vods disableContextProvider={disableContextProvider} />
    </VodsProvider>
  </FeedsCenterContainer>
);

export const Vods = ({ disableContextProvider }) => {
  const { vods, setVods, channels } = useContext(VodsContext);
  const { twitchUserId, setTwitchToken, setRefreshToken } = useContext(AccountContext);
  const { setEnableTwitchVods } = useContext(FeedsContext);
  const { videoElementsAmount } = useContext(CenterContext);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [vodError, setVodError] = useState(null);
  const [vodAmounts, setVodAmounts] = useState({
    amount: videoElementsAmount,
    timeout: 750,
    transitionGroup: 'videos',
  });
  const validateToken = useToken();

  useEventListenerMemo('focus', windowFocusHandler);

  const refresh = useCallback(
    async (forceRefresh) => {
      setRefreshing(true);
      await validateToken().then(() =>
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

            setRefreshing(false);
          })
          .catch((data) => {
            setError(data.error);

            setVods(data.videos);
          })
      );
    },
    [setTwitchToken, setRefreshToken, setVods, channels, validateToken]
  );

  async function windowFocusHandler() {
    refresh(false);
  }

  useEffect(() => {
    (async () => {
      setRefreshing(true);
      await validateToken().then(() =>
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
            setRefreshing(false);
          })
          .catch((data) => {
            setError(data.error);
            setVods(data.videos);
          })
      );
    })();
  }, [twitchUserId, setTwitchToken, setRefreshToken, setVods, channels, validateToken]);

  useEffect(() => {
    debounce(
      () => {
        setVodAmounts({
          amount: videoElementsAmount,
          timeout: 750,
          transitionGroup: 'videos',
        });
      },
      500,
      { leading: true, trailing: true }
    );
  }, [videoElementsAmount]);

  if (!getCookie(`Twitch-access_token`)) {
    return (
      <AlertHandler
        title='Not authenticated/connected with Twitch.'
        message='No access token for twitch availible.'
      />
    );
  }

  return (
    <>
      <Header refresh={refresh} refreshing={refreshing} vods={vods} vodError={vodError} />
      {error && (
        <AlertHandler
          data={error}
          style={{ marginTop: '-150px' }}
          element={
            <Button
              style={{ margin: '0 20px' }}
              variant='danger'
              onClick={() => {
                AddCookie('Twitch_FeedEnabled', false);
                setEnableTwitchVods(false);
              }}
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
            {vods.data.slice(0, vodAmounts.amount).map((vod) => {
              return (
                <CSSTransition
                  key={vod.id}
                  timeout={vodAmounts.timeout}
                  classNames={vod.transition || 'fade-750ms'}
                  unmountOnExit
                >
                  <VodElement data={vod} disableContextProvider={disableContextProvider} />
                </CSSTransition>
              );
            })}
          </TransitionGroup>
          <LoadMore
            loaded={true}
            setVideosToShow={setVodAmounts}
            videosToShow={vodAmounts}
            videos={vods.data}
          />
        </>
      )}
    </>
  );
};
