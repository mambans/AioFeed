import { CSSTransition, TransitionGroup } from "react-transition-group";
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from "react";
import _ from "lodash";

import ErrorHandeling from "../../error/Error";
import getFollowedVods from "./GetFollowedVods";
import TwitchVodElement from "./TwitchVodElement";
import { SubFeedContainer } from "./../../sharedStyledComponents";
import Header from "./Header";
import { StyledLoadmore } from "./../styledComponents";
import AccountContext from "./../../account/AccountContext";
import VodsContext from "./VodsContext";
import LoadingBoxs from "./../LoadingBoxs";

function TwitchVods() {
  const { vods, setVods } = useContext(VodsContext);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [vodError, setVodError] = useState(null);
  const transition = useRef("fade-1s");
  const loadmoreRef = useRef();
  const resetVodAmountsTimer = useRef();
  const VodHeaderRef = useRef();
  const {
    authKey,
    username,
    twitchUserId,
    setTwitchToken,
    setRefreshToken,
    twitchToken,
  } = useContext(AccountContext);

  const [numberOfVideos, setNumberOfVideos] = useState(
    Math.floor((document.documentElement.clientWidth - 430) / 350) *
      Math.floor((document.documentElement.clientHeight - (65 + 484)) / 341)
  );
  const [vodAmounts, setVodAmounts] = useState(numberOfVideos);

  const recalcWidth = useMemo(
    () =>
      _.debounce(
        () => {
          setNumberOfVideos(
            Math.floor((document.documentElement.clientWidth - 430) / 350) *
              Math.floor((document.documentElement.clientHeight - (65 + 484)) / 341)
          );
          setVodAmounts(
            Math.floor((document.documentElement.clientWidth - 430) / 350) *
              Math.floor((document.documentElement.clientHeight - (65 + 484)) / 341)
          );
        },
        100,
        { leading: true, trailing: false }
      ),
    []
  );

  useEffect(() => {
    window.addEventListener("resize", recalcWidth);

    return () => {
      window.removeEventListener("resize", recalcWidth);
    };
  }, [recalcWidth]);

  //eslint-disable-next-line
  const observer = useMemo(
    () =>
      new IntersectionObserver(
        function(entries) {
          // isIntersecting is true when element and viewport are overlapping
          // isIntersecting is false when element and viewport don't overlap

          window.addEventListener(
            "wheel",
            _.throttle(
              function(e) {
                if (entries[0].isIntersecting === true) {
                  setVodAmounts(currVodAmounts => currVodAmounts + numberOfVideos / 2);
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
    async forceRefresh => {
      setRefreshing(true);
      await getFollowedVods(
        forceRefresh,
        authKey,
        username,
        parseInt(twitchUserId),
        setRefreshToken,
        setTwitchToken
      )
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else if (data.vodError) {
            setVodError(data.vodError);
          }
          setVods(data.data);
          setRefreshing(false);
        })
        .catch(data => {
          setError(data.error);
          setVods(data.data);
        });
    },
    [authKey, username, twitchUserId, setTwitchToken, setRefreshToken, setVods]
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
      await getFollowedVods(
        false,
        authKey,
        username,
        parseInt(twitchUserId),
        setRefreshToken,
        setTwitchToken
      )
        .then(data => {
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
        .catch(data => {
          setError(data.error);
          setVods(data.data);
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
      <ErrorHandeling
        data={{
          title: "Not authenticated/connected with Twitch.",
          message: "No access token for twitch available.",
        }}></ErrorHandeling>
    );
  } else if (error) {
    return (
      <>
        <Header refresh={refresh} refreshing={refreshing} vods={vods} ref={VodHeaderRef} />
        <ErrorHandeling data={error} style={{ marginTop: "-150px" }}></ErrorHandeling>
      </>
    );
  }
  if (vods === undefined || !vods || !vods.data) {
    return (
      <>
        <Header refresh={refresh} refreshing={refreshing} vods={vods} ref={VodHeaderRef} />
        <LoadingBoxs
          amount={Math.floor(((document.documentElement.clientWidth - 150) / 350) * 1.5)}
          type='Vods'
        />
      </>
    );
  } else if (!twitchToken) {
    return (
      <ErrorHandeling
        data={{
          title: "Couldn't load Twitch-vod feed",
          message: "You are not connected with your Twitch account to Notifies",
        }}></ErrorHandeling>
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
            {vods.data.slice(0, vodAmounts).map(vod => {
              return (
                <CSSTransition
                  key={vod.id}
                  timeout={1000}
                  classNames={transition.current}
                  // classNames='videoFade-1s'
                  unmountOnExit>
                  <TwitchVodElement
                    data={vod}
                    transition={transition.current}
                    // setTransition={() => {
                    //   transition.current = "videoFade-1s";
                    // }}
                  />
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
}

export default TwitchVods;
