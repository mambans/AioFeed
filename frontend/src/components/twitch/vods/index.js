import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Button } from 'react-bootstrap';

import ErrorHandler from '../../error';
import getFollowedVods from './GetFollowedVods';
import VodElement from './VodElement';
import { SubFeedContainer, LoadMore } from './../../sharedStyledComponents';
import Header from './Header';
import AccountContext from './../../account/AccountContext';
import VodsContext from './VodsContext';
import LoadingBoxes from './../LoadingBoxes';
import FeedsContext from '../../feed/FeedsContext';
import { AddCookie, getCookie } from '../../../util/Utils';

export default ({ videoElementsAmount }) => {
  const { vods, setVods } = useContext(VodsContext);
  const { authKey, username, twitchUserId, setTwitchToken, setRefreshToken } = useContext(
    AccountContext,
  );
  const { setEnableTwitchVods } = useContext(FeedsContext);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [vodError, setVodError] = useState(null);
  const resetVodAmountsTimer = useRef();
  const resetTransitionTimer = useRef();
  const VodHeaderRef = useRef();
  const [vodAmounts, setVodAmounts] = useState({
    amount: videoElementsAmount || 14,
    timeout: 750,
    transitionGroup: 'videos',
  });

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
    [authKey, username, setTwitchToken, setRefreshToken, setVods],
  );

  const windowFocusHandler = useCallback(async () => {
    clearTimeout(resetVodAmountsTimer.current);
    refresh(false);
  }, [refresh]);

  const windowBlurHandler = useCallback(() => {
    resetVodAmountsTimer.current = setTimeout(() => {
      if (vodAmounts.amount > videoElementsAmount) {
        window.scrollTo(0, 0);
        setVodAmounts(videoElementsAmount);
      }
    }, 350000);
  }, [vodAmounts, videoElementsAmount]);

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
    window.addEventListener('focus', windowFocusHandler);
    window.addEventListener('blur', windowBlurHandler);

    return () => {
      window.removeEventListener('blur', windowBlurHandler);
      window.removeEventListener('focus', windowFocusHandler);
      clearTimeout(resetVodAmountsTimer.current);
    };
  }, [
    windowBlurHandler,
    windowFocusHandler,
    authKey,
    username,
    twitchUserId,
    setTwitchToken,
    setRefreshToken,
    setVods,
  ]);

  if (!getCookie(`Twitch-access_token`)) {
    return (
      <ErrorHandler
        data={{
          title: 'Not authenticated/connected with Twitch.',
          message: 'No access token for twitch availible.',
        }}
      ></ErrorHandler>
    );
  } else if (error) {
    return (
      <>
        <Header refresh={refresh} refreshing={refreshing} vods={vods} ref={VodHeaderRef} />
        <ErrorHandler
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
        ></ErrorHandler>
      </>
    );
  }

  if (!vods || !vods.data) {
    return (
      <>
        <Header refresh={refresh} refreshing={refreshing} vods={vods} ref={VodHeaderRef} />
        <LoadingBoxes amount={videoElementsAmount || 14} type='Vods' />
      </>
    );
  } else {
    return (
      <>
        <Header
          refresh={refresh}
          refreshing={refreshing}
          vods={vods}
          ref={VodHeaderRef}
          vodError={vodError}
        />
        <TransitionGroup
          className={vodAmounts.transitionGroup || 'videos'}
          component={SubFeedContainer}
        >
          {vods.data.slice(0, vodAmounts.amount).map((vod) => {
            return (
              <CSSTransition
                key={vod.id}
                // key={vod.id + vod.duration}
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
    );
  }
};
