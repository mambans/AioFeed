import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';

import getFollowedVods from './GetFollowedVods';
import VodElement from './VodElement';
import LoadMore from '../../../components/loadMore/LoadMore';
import { SubFeedContainer } from './../../sharedComponents/sharedStyledComponents';
import Header from './Header';
import VodsContext from './VodsContext';
import LoadingBoxes from './../LoadingBoxes';
import FeedsContext from '../../feed/FeedsContext';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import { CenterContext } from './../../feed/FeedsCenterContainer';
import { Container } from '../StyledComponents';
import useToken, { TwitchContext } from '../useToken';
import ExpandableSection from '../../../components/expandableSection/ExpandableSection';
import Alert from '../../../components/alert';
import { getLocalstorage } from '../../../util';

const Vods = ({ className }) => {
  const { vods, setVods, channels, fetchVodsContextData } = useContext(VodsContext);
  const { orders, toggleExpanded } = useContext(FeedsContext) || {};
  const { videoElementsAmount } = useContext(CenterContext);
  const { twitchAccessToken, twitchUserId } = useContext(TwitchContext);
  const validateToken = useToken();
  const [error, setError] = useState(null);
  const [vodError, setVodError] = useState(null);
  const [vodAmounts, setVodAmounts] = useState({
    amount: videoElementsAmount * 2,
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
        channels,
        currentVods: getLocalstorage('TwitchVods'),
      }).then((data) => {
        setError(data?.er);
        setVodError(data?.vodError);

        if (data?.data) setVods(data.data);
        refreshBtnRef?.current?.setIsLoading(false);
        return data;
      });
    },
    [setVods, channels, fetchVodsContextData]
  );

  async function windowFocusHandler() {
    refresh(false);
  }

  useEffect(() => {
    (async () => {
      console.log('vods index useEffect fetch vods:');
      if (validateToken) {
        refreshBtnRef?.current?.setIsLoading(true);
        const data = await getFollowedVods({
          forceRun: false,

          channels,
          currentVods: getLocalstorage('TwitchVods'),
        });

        setError(data?.er);
        setVodError(data?.vodError);
        if (data?.videos) setVods(data?.videos);
        refreshBtnRef?.current?.setIsLoading(false);
      }
    })();
  }, [twitchUserId, setVods, channels, validateToken]);

  useEffect(() => {
    setVodAmounts({
      amount: videoElementsAmount * 2,
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
        {error && <Alert data={error} fill />}
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
export default Vods;
