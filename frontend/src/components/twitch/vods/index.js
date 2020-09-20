import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Button } from 'react-bootstrap';

import AlertHandler from '../../alert';
import getFollowedVods from './GetFollowedVods';
import VodElement from './VodElement';
import { SubFeedContainer, LoadMore } from './../../sharedStyledComponents';
import Header from './Header';
import AccountContext from './../../account/AccountContext';
import VodsContext from './VodsContext';
import LoadingBoxes from './../LoadingBoxes';
import FeedsContext from '../../feed/FeedsContext';
import { AddCookie, getCookie } from '../../../util/Utils';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import { CenterContext } from './../../feed/FeedsCenterContainer';

export default () => {
  const { vods, setVods } = useContext(VodsContext);
  const { authKey, username, twitchUserId, setTwitchToken, setRefreshToken } = useContext(
    AccountContext
  );
  const { setEnableTwitchVods } = useContext(FeedsContext);
  const { videoElementsAmount } = useContext(CenterContext);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [vodError, setVodError] = useState(null);
  const resetVodAmountsTimer = useRef();
  const resetTransitionTimer = useRef();
  const VodHeaderRef = useRef();
  const [vodAmounts, setVodAmounts] = useState({
    amount: videoElementsAmount,
    timeout: 750,
    transitionGroup: 'videos',
  });

  useEventListenerMemo('focus', windowFocusHandler);
  useEventListenerMemo('blur', windowBlurHandler);

  const refresh = useCallback(
    async (forceRefresh) => {
      setRefreshing(true);
      await getFollowedVods(forceRefresh, authKey, username, setRefreshToken, setTwitchToken)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else if (data.vodError) {
            setVodError(data.vodError);
          }
          setVods(data.data);

          setRefreshing(false);
        })
        .catch((data) => {
          setError(data.error);

          setVods(data.data);
        });
    },
    [authKey, username, setTwitchToken, setRefreshToken, setVods]
  );

  async function windowFocusHandler() {
    clearTimeout(resetVodAmountsTimer.current);
    refresh(false);
  }

  function windowBlurHandler() {
    resetVodAmountsTimer.current = setTimeout(() => {
      if (vodAmounts.amount > videoElementsAmount) {
        window.scrollTo(0, 0);
        setVodAmounts(videoElementsAmount);
      }
    }, 350000);
  }

  useEffect(() => {
    (async () => {
      setRefreshing(true);
      await getFollowedVods(false, authKey, username, setRefreshToken, setTwitchToken)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else if (data.vodError) {
            setVodError(data.vodError);
          }

          setVods(data.data);
          setRefreshing(false);
        })
        .catch((data) => {
          setError(data.error);

          setVods(data.data);
        });
    })();

    return () => {
      clearTimeout(resetVodAmountsTimer.current);
    };
  }, [authKey, username, twitchUserId, setTwitchToken, setRefreshToken, setVods]);

  useEffect(() => {
    setVodAmounts({
      amount: videoElementsAmount,
      timeout: 750,
      transitionGroup: 'videos',
    });
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
      <Header
        refresh={refresh}
        refreshing={refreshing}
        vods={vods}
        ref={VodHeaderRef}
        vodError={vodError}
      />
      {error ? (
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
      ) : !vods || !vods.data ? (
        <LoadingBoxes amount={videoElementsAmount} type='Vods' />
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
                  <VodElement data={vod} />
                </CSSTransition>
              );
            })}
          </TransitionGroup>
          <LoadMore
            loaded={true}
            text={vodAmounts.amount >= vods.data.length ? 'Show less (reset)' : 'Show more'}
            onClick={() => {
              if (vodAmounts.amount >= vods.data.length) {
                setVodAmounts({
                  amount: videoElementsAmount,
                  timeout: 0,
                  transitionGroup: 'instant-disappear',
                });

                clearTimeout(resetTransitionTimer.current);
                resetTransitionTimer.current = setTimeout(() => {
                  setVodAmounts({
                    amount: videoElementsAmount,
                    timeout: 750,
                    transitionGroup: 'videos',
                  });
                }, 750);
              } else {
                setVodAmounts((curr) => ({
                  amount: curr.amount + videoElementsAmount,
                  timeout: 750,
                  transitionGroup: 'videos',
                }));
              }
              clearTimeout(resetVodAmountsTimer.current);
            }}
            resetFunc={() => {
              setVodAmounts({
                amount: videoElementsAmount,
                timeout: 0,
                transitionGroup: 'instant-disappear',
              });
              clearTimeout(resetTransitionTimer.current);
              resetTransitionTimer.current = setTimeout(() => {
                setVodAmounts({
                  amount: videoElementsAmount,
                  timeout: 750,
                  transitionGroup: 'videos',
                });
              }, 750);
            }}
          />
        </>
      )}
    </>
  );
};
