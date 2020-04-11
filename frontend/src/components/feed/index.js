import { Alert } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import { debounce } from "lodash";
import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
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
import Util from "../../util/Util";
import Youtube from "./../youtube/Youtube";
import YoutubeDataHandler from "./../youtube/Datahandler";
import YoutubeHeader from "./../youtube/Header";

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: column;
  margin-top: 25px;
  margin-left: ${({ marginLeft }) => marginLeft + "px"};
  width: ${({ width }) => width + "px"} !important;
`;

const TwitchContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

export default () => {
  document.title = "AioFeed | Feed";
  const {
    enableTwitch,
    enableYoutube,
    enableTwitchVods,
    enableTwitter,
    twitterListName,
  } = useContext(FeedsContext);
  const { username } = useContext(AccountContext);
  const [delayedEnableYoutube, setDelayedEnableYoutube] = useState(false);
  const [delayedEnableTwitchVods, setDelayedEnableTwitchVods] = useState(false);
  const calcAlignments = useCallback(() => {
    const twitterWidth = enableTwitter
      ? window.innerWidth <= 1920
        ? window.innerWidth * 0.2
        : window.innerWidth <= 2560
        ? window.innerWidth * 0.2
        : window.innerWidth * 0.15
      : 0;

    const centerWidth = enableTwitter
      ? 350 * Math.floor((window.innerWidth - (275 + window.innerWidth * 0.2 + 25)) / 350)
      : 350 * Math.floor((window.innerWidth - (275 + 150)) / 350);

    const centerMargin = enableTwitter
      ? (window.innerWidth - (275 + twitterWidth + 25 + centerWidth)) / 2 + 275
      : (window.innerWidth - (275 + centerWidth)) / 2 + 275 - 50;

    return {
      width: centerWidth,
      margin: centerMargin,
      twitterWidth: twitterWidth,
    };
  }, [enableTwitter]);
  const [alignments, setAlignments] = useState(calcAlignments);

  const recalcWidth = useMemo(
    () =>
      debounce(
        () => {
          setAlignments(calcAlignments());
        },
        75,
        { leading: true, trailing: false }
      ),
    [calcAlignments]
  );

  useEffect(() => {
    Notification.requestPermission().then(function (result) {
      console.log("Notifications: ", result);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", recalcWidth);

    return () => {
      window.removeEventListener("resize", recalcWidth);
    };
  }, [recalcWidth]);

  useEffect(() => {
    const FEEDDELAY = 2500;

    window.setTimeout(
      () => {
        setDelayedEnableYoutube("true");
      },
      enableTwitch ? FEEDDELAY : 0
    );

    window.setTimeout(
      () => {
        setDelayedEnableTwitchVods("true");
      },
      enableYoutube ? FEEDDELAY * 2 : FEEDDELAY
    );
  }, [enableTwitch, enableYoutube]);

  useEffect(() => {
    setAlignments(calcAlignments());
  }, [enableTwitter, calcAlignments]);

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
  } else if (
    !enableTwitch &&
    !enableTwitter &&
    !twitterListName &&
    !enableYoutube &&
    !enableTwitchVods &&
    username
  ) {
    return (
      <CSSTransition in={true} timeout={1000} classNames='fade-1s' unmountOnExit>
        <Alert variant='info' style={Util.feedAlertWarning}>
          <Alert.Heading>No feeds are enabled</Alert.Heading>
          <hr />
          Please enable some feeds in account settings
        </Alert>
      </CSSTransition>
    );
  } else {
    return (
      <CenterContainer width={alignments.width} marginLeft={alignments.margin}>
        {enableTwitter && twitterListName && <Twitter width={alignments.twitterWidth} />}

        <VodsProvider>
          {enableTwitch && (
            <Handler>
              {(data) => (
                <CSSTransition
                  in={enableTwitch}
                  timeout={750}
                  classNames='fade-750ms'
                  unmountOnExit>
                  <TwitchContainer>
                    <TwitchLive data={data} />
                  </TwitchContainer>
                </CSSTransition>
              )}
            </Handler>
          )}

          {enableTwitchVods && delayedEnableTwitchVods && (
            <Container>
              <TwitchVods />
            </Container>
          )}
        </VodsProvider>

        {enableYoutube && delayedEnableYoutube && (
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
