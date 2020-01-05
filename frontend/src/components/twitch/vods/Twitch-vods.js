import { CSSTransition, TransitionGroup } from "react-transition-group";
import { list2 } from "react-icons-kit/icomoon/list2";
import { reload } from "react-icons-kit/iconic/reload";
import { Spinner } from "react-bootstrap";
import { video } from "react-icons-kit/iconic/video";
import Icon from "react-icons-kit";
import Moment from "react-moment";
import Popup from "reactjs-popup";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import _ from "lodash";

import AddChannelForm from "./VodSettings";
import ErrorHandeling from "../../error/Error";
import getFollowedVods from "./GetFollowedVods";
import TwitchVodElement from "./TwitchVodElement";
import styles from "./../Twitch.module.scss";
import Utilities from "../../../utilities/Utilities";
import {
  RefreshButton,
  HeaderTitle,
  HeaderContainer,
  SubFeedContainer,
  ButtonList,
} from "./../../sharedStyledComponents";

import { StyledLoadmore } from "./../styledComponents";

const HeaderContainerFade = React.forwardRef((props, ref) => {
  const { refresh, refreshing, vods } = props;
  return (
    <HeaderContainer ref={ref}>
      <div
        style={{
          width: "300px",
          minWidth: "300px",
          alignItems: "end",
          display: "flex",
        }}>
        <RefreshButton
          onClick={() => {
            refresh(true);
          }}>
          {refreshing ? (
            <div style={{ height: "25.5px" }}>
              <Spinner
                animation='border'
                role='status'
                variant='light'
                style={Utilities.loadingSpinnerSmall}></Spinner>
            </div>
          ) : (
            <Icon icon={reload} size={22}></Icon>
          )}
        </RefreshButton>
        <Moment fromNow className={styles.vodRefreshTimer} interval={60000}>
          {(vods && vods.loaded) || new Date()}
        </Moment>
        {/* <Moment
            from={(vods && vods.expire) || new Date()}
            ago
            className={styles.vodRefreshTimer}></Moment> */}
      </div>
      <HeaderTitle>
        Twitch vods
        <Icon icon={video} size={32} style={{ paddingLeft: "10px", color: "#6f166f" }}></Icon>
      </HeaderTitle>
      <Popup
        placeholder='Channel name..'
        arrow={false}
        trigger={
          <ButtonList variant='outline-secondary' className={styles.settings}>
            <Icon
              icon={list2}
              size={22}
              style={{
                height: "22px",
                alignItems: "center",
                display: "flex",
              }}></Icon>
          </ButtonList>
        }
        position='left top'
        className='settingsPopup'>
        <AddChannelForm refresh={refresh} />
      </Popup>
    </HeaderContainer>
  );
});

function TwitchVods() {
  const nrStreams =
    Math.floor((document.documentElement.clientWidth - 430) / 350) *
    Math.floor((document.documentElement.clientHeight - (65 + 75 + 450)) / 337);

  const [vods, setVods] = useState();
  // const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [vodAmounts, setVodAmounts] = useState(nrStreams);
  const transition = useRef("fade-1s");
  const loadmoreRef = useRef();
  const resetVodAmountsTimer = useRef();
  const VodHeaderRef = useRef();

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

  const refresh = useCallback(async forceRefresh => {
    setRefreshing(true);
    await getFollowedVods(forceRefresh)
      .then(data => {
        if (data.error) setError(data.error);
        setVods(data.data);
        // setIsLoaded(true);
        setRefreshing(false);
      })
      .catch(data => {
        setError(data.error);
        setVods(data.data);
      });
  }, []);

  const windowFocusHandler = useCallback(async () => {
    refresh(false);
  }, [refresh]);

  const windowBlurHandler = useCallback(() => {}, []);

  useEffect(() => {
    const loadmore = loadmoreRef.current;

    async function fetchData() {
      setRefreshing(true);
      await getFollowedVods()
        .then(data => {
          if (data.error) setError(data.error);

          setVods(data.data);
          // setIsLoaded(true);
          setRefreshing(false);

          // Enable load more vods on Scroll
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
      observer.unobserve(loadmore);
      clearTimeout(resetVodAmountsTimer.current);
    };
  }, [windowBlurHandler, windowFocusHandler]);

  // function throttle(fn, wait) {
  //   var time = Date.now();
  //   return function() {
  //     if (time + wait - Date.now() < 0) {
  //       fn();
  //       time = Date.now();
  //     }
  //   };
  // }

  if (Utilities.getCookie("Twitch-access_token") === null) {
    return (
      <ErrorHandeling
        data={{
          title: "Not authenticated/connected with Twitch.",
          message: "No access token for twitch available.",
        }}></ErrorHandeling>
    );
  } else if (error) {
    return <ErrorHandeling data={error}></ErrorHandeling>;
  }
  // if (!isLoaded) {
  if (vods === undefined || !vods || !vods.data) {
    return (
      <>
        <HeaderContainerFade
          refresh={refresh}
          refreshing={refreshing}
          vods={vods}
          ref={VodHeaderRef}
        />
        <Spinner animation='grow' role='status' style={Utilities.loadingSpinner} variant='light'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
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
        <HeaderContainerFade
          refresh={refresh}
          refreshing={refreshing}
          vods={vods}
          ref={VodHeaderRef}
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
