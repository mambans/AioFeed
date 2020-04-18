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

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: column;
  margin-top: 25px;
  /* margin-left: ${({ marginLeft }) => marginLeft + "px"}; */
  margin-left: ${({ enableTwitter }) =>
    enableTwitter
      ? (window.innerWidth -
          (275 +
            (enableTwitter
              ? window.innerWidth <= 1920
                ? window.innerWidth * 0.2
                : window.innerWidth <= 2560
                ? window.innerWidth * 0.2
                : window.innerWidth * 0.15
              : 0) +
            25 +
            (enableTwitter
              ? 350 * Math.floor((window.innerWidth - (275 + window.innerWidth * 0.2 + 25)) / 350)
              : 350 * Math.floor((window.innerWidth - (275 + 150)) / 350)))) /
          2 +
        275
      : (window.innerWidth -
          (275 +
            (enableTwitter
              ? 350 * Math.floor((window.innerWidth - (275 + window.innerWidth * 0.2 + 25)) / 350)
              : 350 * Math.floor((window.innerWidth - (275 + 150)) / 350)))) /
          2 +
        275 -
        50}px;
  /* width: ${({ width }) => width + "px"} !important; */
  width: ${({ enableTwitter }) =>
    enableTwitter
      ? 350 * Math.floor((window.innerWidth - (275 + window.innerWidth * 0.2 + 25)) / 350)
      : 350 * Math.floor((window.innerWidth - (275 + 150)) / 350)}px !important;
  transition: width 750ms, margin 750ms;
`;

// const TwitchContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   width: 100%;
// `;

export default () => {
  document.title = "AioFeed | Feed";
  const { enableTwitch, enableYoutube, enableTwitchVods, enableTwitter } = useContext(FeedsContext);
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
        50,
        { leading: true, trailing: false }
      ),
    []
  );

  // const asd = () => {
  //   console.log("asd");
  //   setScreenWidth(window.innerWidth);
  // };

  useEffect(() => {
    window.addEventListener("resize", setScreenWidthToCalcAlignments);

    return () => {
      window.removeEventListener("resize", setScreenWidthToCalcAlignments);
    };
  }, [setScreenWidthToCalcAlignments]);

  // useEffect(() => {
  //
  // }, [screenWidth]);

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
        // screenWidth={screenWidth}
        id='CenterContainer'>
        <NoFeedsEnable />
        <Twitter />
        <VodsProvider>
          {enableTwitch && (
            <Handler centerContainerRef={centerContainerRef.current}>
              {(data) => (
                <CSSTransition
                  in={enableTwitch}
                  timeout={750}
                  classNames='fade-750ms'
                  unmountOnExit>
                  {/* <TwitchContainer> */}
                  <TwitchLive data={data} />
                  {/* </TwitchContainer> */}
                </CSSTransition>
              )}
            </Handler>
          )}

          {enableTwitchVods && (
            <Container>
              <TwitchVods
                enableTwitter={enableTwitter}
                centerContainerRef={centerContainerRef.current}
              />
            </Container>
          )}
        </VodsProvider>
        {enableYoutube && (
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
        )}
      </CenterContainer>
    );
  }
};
