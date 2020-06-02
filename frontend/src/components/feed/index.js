import { CSSTransition } from "react-transition-group";
import { debounce } from "lodash";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";

import { AddCookie } from "../../util/Utils";
import { Container, CenterContainer } from "../twitch/StyledComponents";
import { HideSidebarButton } from "../twitch/sidebar/StyledComponents";
import { VodsProvider } from "./../twitch/vods/VodsContext";
import AccountContext from "./../account/AccountContext";
import ErrorHandler from "./../error";
import FeedsContext from "./FeedsContext";
import Handler from "../twitch/live/Handler";
import Header from "../twitch/live/Header";
import NoFeedsEnable from "./NoFeedsEnabled";
import Sidebar from "../twitch/sidebar";
import TwitchLive from "../twitch/live";
import TwitchVods from "../twitch/vods";
import Twitter from "../twitter";
import Youtube from "./../youtube";
import YoutubeDataHandler from "./../youtube/Datahandler";
import YoutubeHeader from "./../youtube/Header";

export default () => {
  document.title = "AioFeed | Feed";
  const {
    enableTwitch,
    enableYoutube,
    enableTwitchVods,
    enableTwitter,
    showTwitchSidebar,
    setShowTwitchSidebar,
  } = useContext(FeedsContext);
  const { username } = useContext(AccountContext);
  // eslint-disable-next-line no-unused-vars
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const centerContainerRef = useRef();

  useEffect(() => {
    Notification.requestPermission().then(function (result) {
      console.log("Notifications: ", result);
    });
  }, []);

  const setScreenWidthToCalcAlignments = useMemo(
    () =>
      debounce(
        () => {
          setScreenWidth(window.innerWidth);
        },
        20,
        { leading: true, trailing: false }
      ),
    []
  );

  useEffect(() => {
    window.addEventListener("resize", setScreenWidthToCalcAlignments);

    return () => {
      window.removeEventListener("resize", setScreenWidthToCalcAlignments);
    };
  }, [setScreenWidthToCalcAlignments]);

  if (!username) {
    return (
      <>
        <ErrorHandler
          data={{
            title: "Please login",
            message: "You are not logged with your AioFeed account.",
          }}></ErrorHandler>
      </>
    );
  } else {
    return (
      <CenterContainer
        ref={centerContainerRef}
        enableTwitter={enableTwitter}
        enableTwitch={enableTwitch}
        showTwitchSidebar={showTwitchSidebar}
        twitterWidth={
          enableTwitter ? window.innerWidth * (window.innerWidth <= 2560 ? 0.2 : 0.15) : 0
        }
        twitchSidebarWidth={enableTwitch && showTwitchSidebar ? 275 : 0}
        centerWidth={
          350 *
          Math.floor(
            (window.innerWidth -
              ((enableTwitch && showTwitchSidebar ? 275 : 0) +
                (enableTwitter
                  ? window.innerWidth * (window.innerWidth <= 2560 ? 0.2 : 0.15)
                  : 150) +
                25)) /
              350
          )
        }
        id='CenterContainer'>
        <NoFeedsEnable />
        <Twitter />
        <VodsProvider>
          <CSSTransition
            in={enableTwitch}
            classNames='fade-750ms'
            timeout={750}
            unmountOnExit
            appear>
            <Handler>
              {(data) => (
                <>
                  <CSSTransition
                    in={enableTwitch}
                    timeout={750}
                    classNames='fade-750ms'
                    unmountOnExit>
                    <Header data={data} />
                  </CSSTransition>
                  <CSSTransition
                    in={enableTwitch}
                    timeout={750}
                    classNames='fade-750ms'
                    appear
                    unmountOnExit>
                    <TwitchLive data={data} centerContainerRef={centerContainerRef.current} />
                  </CSSTransition>

                  <OverlayTrigger
                    key={"bottom"}
                    placement={"right"}
                    delay={{ show: 500, hide: 0 }}
                    overlay={
                      <Tooltip id={`tooltip-${"right"}`}>{`${
                        showTwitchSidebar ? "Hide" : "Show"
                      } sidebar`}</Tooltip>
                    }>
                    <HideSidebarButton
                      show={String(showTwitchSidebar)}
                      onClick={() => {
                        AddCookie("Twitch_SidebarEnabled", !showTwitchSidebar);
                        setShowTwitchSidebar(!showTwitchSidebar);
                      }}>
                      Hide
                    </HideSidebarButton>
                  </OverlayTrigger>

                  <CSSTransition
                    in={enableTwitch && showTwitchSidebar}
                    timeout={750}
                    classNames='twitchSidebar'
                    appear
                    unmountOnExit>
                    <Sidebar
                      setShowTwitchSidebar={setShowTwitchSidebar}
                      loaded={data.loaded}
                      onlineStreams={data.liveStreams}
                      newlyAdded={data.newlyAddedStreams}
                      REFRESH_RATE={data.REFRESH_RATE}
                    />
                  </CSSTransition>
                </>
              )}
            </Handler>
          </CSSTransition>

          <CSSTransition in={enableTwitchVods} classNames='fade-750ms' timeout={750} unmountOnExit>
            <Container>
              <TwitchVods centerContainerRef={centerContainerRef.current} />
            </Container>
          </CSSTransition>
        </VodsProvider>

        <CSSTransition
          in={enableYoutube}
          timeout={750}
          classNames='fade-750ms'
          unmountOnExit
          appear>
          <Container>
            <YoutubeDataHandler>
              {(data) => (
                <>
                  <YoutubeHeader
                    videos={data.videos}
                    setVideos={data.setVideos}
                    refresh={data.refresh}
                    isLoaded={data.isLoaded}
                    requestError={data.requestError}
                    followedChannels={data.followedChannels}
                  />

                  {data.error && <ErrorHandler data={data.error}></ErrorHandler>}

                  <Youtube
                    centerContainerRef={centerContainerRef.current}
                    requestError={data.requestError}
                    videos={data.videos}
                  />
                </>
              )}
            </YoutubeDataHandler>
          </Container>
        </CSSTransition>
      </CenterContainer>
    );
  }
};
