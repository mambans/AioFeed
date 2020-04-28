import { CSSTransition } from "react-transition-group";
import { debounce } from "lodash";
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import styled from "styled-components";

import { Container } from "../twitch/StyledComponents";
import { VodsProvider } from "./../twitch/vods/VodsContext";
import AccountContext from "./../account/AccountContext";
import ErrorHandler from "./../error";
import FeedsContext from "./FeedsContext";
import Handler from "../twitch/live/Handler";
import TwitchLive from "../twitch/live";
import TwitchVods from "../twitch/vods";
import Twitter from "../twitter";
import Youtube from "./../youtube";
import YoutubeDataHandler from "./../youtube/Datahandler";
import YoutubeHeader from "./../youtube/Header";
import NoFeedsEnable from "./NoFeedsEnabled";
import Sidebar from "../twitch/sidebar";
import Header from "../twitch/live/Header";
import { HideSidebarButton } from "../twitch/sidebar/StyledComponents";
import { AddCookie } from "../../util/Utils";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: column;
  margin-top: 25px;
  /* margin-left: ${({ marginLeft }) => marginLeft + "px"}; */
  margin-left: ${({ enableTwitter, enableTwitch, showTwitchSidebar }) =>
    !enableTwitter && (!enableTwitch || !showTwitchSidebar)
      ? "auto"
      : enableTwitter
      ? (window.innerWidth -
          ((enableTwitch && showTwitchSidebar ? 275 : 0) +
            (enableTwitter
              ? window.innerWidth <= 1920
                ? window.innerWidth * 0.2
                : window.innerWidth <= 2560
                ? window.innerWidth * 0.2
                : window.innerWidth * 0.15
              : 0) +
            25 +
            (enableTwitter
              ? 350 *
                Math.floor(
                  (window.innerWidth -
                    ((enableTwitch && showTwitchSidebar ? 275 : 0) +
                      window.innerWidth * 0.2 +
                      25)) /
                    350
                )
              : 350 *
                Math.floor(
                  (window.innerWidth - ((enableTwitch && showTwitchSidebar ? 275 : 0) + 150)) / 350
                )))) /
          2 +
        (enableTwitch && showTwitchSidebar ? 275 : 0) +
        "px"
      : (window.innerWidth -
          ((enableTwitch && showTwitchSidebar ? 275 : 0) +
            (enableTwitter
              ? 350 *
                Math.floor(
                  (window.innerWidth -
                    ((enableTwitch && showTwitchSidebar ? 275 : 0) +
                      window.innerWidth * 0.2 +
                      25)) /
                    350
                )
              : 350 *
                Math.floor(
                  (window.innerWidth - ((enableTwitch && showTwitchSidebar ? 275 : 0) + 150)) / 350
                )))) /
          2 +
        (enableTwitch && showTwitchSidebar ? 275 : 0) -
        50 +
        "px"};
  margin-right: ${({ enableTwitter, enableTwitch, showTwitchSidebar }) =>
    !enableTwitter && (!enableTwitch || !showTwitchSidebar) ? "auto" : "unset"};
  width: ${({ enableTwitter, enableTwitch }) =>
    enableTwitter
      ? 350 *
        Math.floor(
          (window.innerWidth - ((enableTwitch ? 275 : 0) + window.innerWidth * 0.2 + 25)) / 350
        )
      : 350 *
        Math.floor((window.innerWidth - ((enableTwitch ? 275 : 0) + 150)) / 350)}px !important;
  transition: width 750ms, margin 750ms;
`;

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
        33,
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
                    <Header data={data} refresh={data.refresh} />
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
                      show={showTwitchSidebar}
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
                    initiated={data.initiated}
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
