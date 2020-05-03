import { CSSTransition, TransitionGroup } from "react-transition-group";
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from "react";
import { throttle } from "lodash";
import { Button } from "react-bootstrap";

import ErrorHandler from "../../error";
import getFollowedVods from "./GetFollowedVods";
import VodElement from "./VodElement";
import { SubFeedContainer } from "./../../sharedStyledComponents";
import Header from "./Header";
import { StyledLoadmore } from "./../StyledComponents";
import AccountContext from "./../../account/AccountContext";
import VodsContext from "./VodsContext";
import LoadingBoxes from "./../LoadingBoxes";
import FeedsContext from "../../feed/FeedsContext";
import { AddCookie } from "../../../util/Utils";
import validateToken from "../validateToken";

export default ({ centerContainerRef }) => {
  const { vods, setVods } = useContext(VodsContext);
  const {
    authKey,
    username,
    twitchUserId,
    setTwitchToken,
    setRefreshToken,
    twitchToken,
  } = useContext(AccountContext);
  const { setEnableTwitchVods } = useContext(FeedsContext);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [vodError, setVodError] = useState(null);
  const loadmoreRef = useRef();
  const resetVodAmountsTimer = useRef();
  const VodHeaderRef = useRef();
  const [numberOfVideos, setNumberOfVideos] = useState(
    centerContainerRef ? Math.floor((centerContainerRef.clientWidth / 350) * 2) : 14
  );
  const [vodAmounts, setVodAmounts] = useState(numberOfVideos);

  useEffect(() => {
    if (centerContainerRef) {
      setNumberOfVideos(Math.floor((centerContainerRef.clientWidth / 350) * 2));
    }
  }, [centerContainerRef]);

  //eslint-disable-next-line
  const observer = useMemo(
    () =>
      new IntersectionObserver(
        function (entries) {
          // isIntersecting is true when element and viewport are overlapping
          // isIntersecting is false when element and viewport don't overlap

          window.addEventListener(
            "wheel",
            throttle(
              function (e) {
                if (entries[0].isIntersecting === true) {
                  setVodAmounts((currVodAmounts) => currVodAmounts + numberOfVideos / 2);
                  setTimeout(() => {
                    if (loadmoreRef.current) {
                      loadmoreRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "end",
                        inline: "nearest",
                      });
                    }
                  }, 0);
                  clearTimeout(resetVodAmountsTimer.current);

                  resetVodAmountsTimer.current = setTimeout(() => {
                    if (VodHeaderRef.current) {
                      VodHeaderRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "nearest",
                      });
                    }

                    setVodAmounts(numberOfVideos);
                  }, 60000);
                }
              },
              1000,
              { trailing: true, leading: false }
            )
          );
        },
        { threshold: 1 }
      ),
    [numberOfVideos]
  );

  const refresh = useCallback(
    async (forceRefresh) => {
      setRefreshing(true);
      await validateToken().then(async () => {
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
      });
    },
    [authKey, username, setTwitchToken, setRefreshToken, setVods]
  );

  const windowFocusHandler = useCallback(async () => {
    clearTimeout(resetVodAmountsTimer.current);
    refresh(false);
  }, [refresh]);

  const windowBlurHandler = useCallback(() => {
    resetVodAmountsTimer.current = setTimeout(() => {
      // if (VodHeaderRef.current) {
      //   VodHeaderRef.current.scrollIntoView({
      //     behavior: "smooth",
      //     block: "center",
      //     inline: "nearest",
      //   });
      //   setVodAmounts(nrStreams);
      // }
      if (vodAmounts > numberOfVideos) {
        window.scrollTo(0, 0);
        setVodAmounts(numberOfVideos);
      }
    }, 350000);
  }, [numberOfVideos, vodAmounts]);

  useEffect(() => {
    //eslint-disable-next-line
    const loadmore = loadmoreRef.current;

    (async () => {
      setRefreshing(true);
      await validateToken().then(async () => {
        await getFollowedVods(false, authKey, username, setRefreshToken, setTwitchToken)
          .then((data) => {
            if (data.error) {
              setError(data.error);
            } else if (data.vodError) {
              setVodError(data.vodError);
            }

            setVods(data.data);
            setRefreshing(false);

            // Enable for "load more" vods on Scroll
            // if (loadmoreRef.current) observer.observe(loadmoreRef.current);
          })
          .catch((data) => {
            setError(data.error);

            setVods(data.data);
          });
      });
    })();
    window.addEventListener("focus", windowFocusHandler);
    window.addEventListener("blur", windowBlurHandler);

    return () => {
      window.removeEventListener("blur", windowBlurHandler);
      window.removeEventListener("focus", windowFocusHandler);
      // Enable for "load more" vods on Scroll
      // observer.unobserve(loadmore);
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

  if (!twitchToken) {
    return (
      <ErrorHandler
        data={{
          title: "Not authenticated/connected with Twitch.",
          message: "No access token for twitch availible.",
        }}></ErrorHandler>
    );
  } else if (error) {
    return (
      <>
        <Header refresh={refresh} refreshing={refreshing} vods={vods} ref={VodHeaderRef} />
        <ErrorHandler
          data={error}
          style={{ marginTop: "-150px" }}
          element={
            <Button
              style={{ margin: "0 20px" }}
              variant='danger'
              onClick={() => {
                AddCookie("Twitch_FeedEnabled", false);
                setEnableTwitchVods(false);
              }}>
              Disable vods
            </Button>
          }></ErrorHandler>
      </>
    );
  }

  if (!vods || !vods.data) {
    return (
      <>
        <Header refresh={refresh} refreshing={refreshing} vods={vods} ref={VodHeaderRef} />
        <LoadingBoxes
          amount={centerContainerRef ? Math.floor((centerContainerRef.clientWidth / 350) * 1.5) : 9}
          type='Vods'
        />
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
        <SubFeedContainer>
          <TransitionGroup className='twitch-vods' component={null}>
            {vods.data.slice(0, vodAmounts).map((vod) => {
              return (
                <CSSTransition
                  key={vod.id + vod.duration}
                  timeout={750}
                  classNames={vod.transition || "fade-750ms"}
                  unmountOnExit>
                  <VodElement data={vod} />
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </SubFeedContainer>
        <StyledLoadmore ref={loadmoreRef}>
          <div />
          <div
            id='Button'
            onClick={() => {
              setVodAmounts(vodAmounts + numberOfVideos);
              setTimeout(() => {
                if (loadmoreRef.current) {
                  loadmoreRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "nearest",
                  });
                }
              }, 0);
              clearTimeout(resetVodAmountsTimer.current);
            }}>
            Show more
          </div>
          <div />
        </StyledLoadmore>
      </>
    );
  }
};
