import { CSSTransition, TransitionGroup } from "react-transition-group";
import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from "react";
import _ from "lodash";

import ErrorHandeling from "../../error/Error";
import getFollowedVods from "./GetFollowedVods";
import TwitchVodElement from "./TwitchVodElement";
import Utilities from "../../../utilities/Utilities";
import { SubFeedContainer } from "./../../sharedStyledComponents";
import Header from "./Header";
import { StyledLoadmore } from "./../styledComponents";
import AccountContext from "./../../account/AccountContext";
import LoadingBoxs from "./../LoadingBoxs";

function TwitchVods() {
  const nrStreams =
    Math.floor((document.documentElement.clientWidth - 430) / 350) *
    Math.floor((document.documentElement.clientHeight - (65 + 75 + 450)) / 337);

  const [vods, setVods] = useState();
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [vodAmounts, setVodAmounts] = useState(nrStreams);
  const [vodError, setVodError] = useState(null);
  const transition = useRef("fade-1s");
  const loadmoreRef = useRef();
  const resetVodAmountsTimer = useRef();
  const VodHeaderRef = useRef();
  const { authKey, username, twitchUserId, setTwitchToken, setRefreshToken } = useContext(
    AccountContext
  );

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
                  setVodAmounts(currVodAmounts => currVodAmounts + nrStreams / 2);
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

                    setVodAmounts(nrStreams);
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
    [nrStreams]
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
    [authKey, username, twitchUserId, setTwitchToken, setRefreshToken]
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
      if (vodAmounts > nrStreams) {
        window.scrollTo(0, 0);
        setVodAmounts(nrStreams);
      }
    }, 350000);
  }, [nrStreams, vodAmounts]);

  useEffect(() => {
    //eslint-disable-next-line
    const loadmore = loadmoreRef.current;

    async function fetchData() {
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
    }

    fetchData();
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
  ]);

  if (Utilities.getCookie("Twitch-access_token") === null) {
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
  } else if (!Utilities.getCookie("Twitch-access_token")) {
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
          <p
            onClick={() => {
              setVodAmounts(vodAmounts + nrStreams);
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
          </p>
          <div />
        </StyledLoadmore>
      </>
    );
  }
}

export default TwitchVods;
