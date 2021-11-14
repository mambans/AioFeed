import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { Button } from 'react-bootstrap';

import AlertHandler from '../../alert';
import getFollowedVods from './GetFollowedVods';
import VodElement from './VodElement';
import LoadMore from './../../sharedComponents/LoadMore';
import { SubFeedContainer } from './../../sharedComponents/sharedStyledComponents';
import Header from './Header';
import VodsContext from './VodsContext';
import LoadingBoxes from './../LoadingBoxes';
import FeedsContext from '../../feed/FeedsContext';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import FeedsCenterContainer, { CenterContext } from './../../feed/FeedsCenterContainer';
import { Container } from '../StyledComponents';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import { TwitchContext } from '../useToken';

const VodsStandalone = () => {
  useDocumentTitle('Twitch Vods');

  return (
    <FeedsCenterContainer left={false} right={false}>
      <Vods className='feed' />
    </FeedsCenterContainer>
  );
};

export const Vods = ({ className }) => {
  const { vods, setVods, channels } = useContext(VodsContext);
  const { setEnableTwitchVods, orders } = useContext(FeedsContext) || {};
  const { videoElementsAmount } = useContext(CenterContext);
  const { twitchAccessToken, setTwitchAccessToken, setTwitchRefreshToken, twitchUserId } =
    useContext(TwitchContext);
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
      getFollowedVods({
        forceRun: forceRefresh,
        setTwitchRefreshToken,
        setTwitchAccessToken,
        channels,
        currentVods: vods,
      }).then((data) => {
        if (data.er) {
          setError(data.er);
        } else if (data.vodError) {
          setVodError(data.vodError);
        }
        refreshBtnRef?.current?.setIsLoading(false);
        setVods(data.data);
        // return data.data;
      });
    },
    [setTwitchAccessToken, setTwitchRefreshToken, setVods, vods, channels]
  );

  async function windowFocusHandler() {
    refresh(false);
  }

  useEffect(() => {
    (async () => {
      refreshBtnRef?.current?.setIsLoading(true);
      setVods((c) => {
        getFollowedVods({
          forceRun: false,
          setTwitchRefreshToken,
          setTwitchAccessToken,
          channels,
          currentVods: c,
        }).then((data) => {
          if (data.er) {
            setError(data.er);
          } else if (data.vodError) {
            setVodError(data.vodError);
          }
          refreshBtnRef?.current?.setIsLoading(false);
          setVods(data.data);
          // return data.data;
        });
      });
    })();
  }, [twitchUserId, setTwitchAccessToken, setTwitchRefreshToken, setVods, channels]);

  useEffect(() => {
    setVodAmounts({
      amount: videoElementsAmount,
      timeout: 750,
      transitionGroup: 'videos',
    });
  }, [videoElementsAmount]);

  return (
    <Container order={orders['vods']} className={className}>
      <Header ref={refreshBtnRef} refresh={refresh} vods={vods} vodError={vodError} />
      {!twitchAccessToken && (
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
    </Container>
  );
};
export default VodsStandalone;
