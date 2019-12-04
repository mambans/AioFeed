import { Animated } from "react-animated-css";
import React, { useRef, useCallback, useState, useEffect } from "react";
import Moment from "react-moment";
import { Icon } from "react-icons-kit";
import { cross } from "react-icons-kit/icomoon/cross";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Alert from "react-bootstrap/Alert";
import { eye } from "react-icons-kit/icomoon/eye";

import styles from "./Twitch.module.scss";
import StreamHoverIframe from "./StreamHoverIframe.js";
import Utilities from "../../utilities/Utilities";
import UnfollowStream from "./UnfollowStream";
import { VideoTitle, ImageContainer, UnfollowButton } from "./../sharedStyledComponents";

const HOVER_DELAY = 500; // 1000

function HighlightAnimation({ data }) {
  if (data.newlyAddedStreams.includes(data.data.user_name)) {
    return (
      <div
        style={{
          height: 5,
          // backgroundColor: "rgb(14, 203, 247)",
          backgroundColor: "var(--newHighlight)",
          borderRadius: 5,
          gridArea: "highlight",
          transition: "all 3.0s ease-in-out",
          width: "96%",
          margin: "auto",
        }}
      />
    );
  } else {
    return (
      <div
        style={{
          height: 5,
          backgroundColor: "transparent",
          borderRadius: 5,
          gridArea: "highlight",
          width: "96%",
          margin: "auto",
        }}
      />
    );
  }
}

function StreamEle(data) {
  // console.log("TCL: StreamEle -> data", data);
  const [isHovered, setIsHovered] = useState(false);
  const [channelIsHovered, setChannelIsHovered] = useState(false);
  const [unfollowError, setUnfollowError] = useState(false);

  const streamHoverTimer = useRef();
  const ref = useRef();
  const refChannel = useRef();
  const refUnfollowAlert = useRef();

  const formatViewerNumbers = viewers => {
    if (viewers.toString().length === 7) {
      return (viewers / 1000000).toString().substring(0, 5) + "m";
    } else if (viewers.toString().length >= 5) {
      return viewers.toString().substring(0, viewers.toString().length - 3) + "k";
    } else {
      return viewers;
    }
  };

  function UnfollowAlert() {
    if (unfollowError) {
      let alertType = "warning";
      if (unfollowError.includes("Failed")) {
        alertType = "warning";
      } else if (unfollowError.includes("Successfully")) {
        alertType = "success";
      }
      clearTimeout(refUnfollowAlert.current);
      refUnfollowAlert.current = setTimeout(() => {
        setUnfollowError(null);
      }, 6000);
      return (
        <Animated
          animationIn='fadeInUp'
          animationOut='fadeOut'
          animationOutDelay={3500}
          animationOutDuration={2500}
          isVisible={false}
          style={{
            width: "inherit",
            position: "absolute",
            margin: "0",
            height: "30px",
            marginTop: "10px",
          }}>
          <Alert
            variant={alertType}
            style={{
              width: "inherit",
              position: "absolute",
              margin: "0",
              padding: "5px",
              borderRadius: "10px 10px 0 0",
            }}
            className='unfollowErrorAlert'>
            <Alert.Heading
              style={{
                fontSize: "16px",
                textAlign: "center",
                marginBottom: "0",
              }}>
              {unfollowError}{" "}
              <Alert.Link href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
                {data.data.user_name}
              </Alert.Link>
            </Alert.Heading>
          </Alert>
        </Animated>
      );
    } else {
      return "";
    }
  }

  const handleMouseOver = () => {
    streamHoverTimer.current = setTimeout(function() {
      setIsHovered(true);
    }, HOVER_DELAY);
  };

  const handleMouseOut = useCallback(event => {
    clearTimeout(streamHoverTimer.current);
    setIsHovered(false);
  }, []);

  useEffect(() => {
    // console.log(localStorage.getItem(`TwitchVideoHoverEnabled`) === "true");

    if (ref.current && data.twitchVideoHoverEnable) {
      const refEle = ref.current;
      ref.current.addEventListener("mouseenter", handleMouseOver);
      ref.current.addEventListener("mouseleave", handleMouseOut);

      return () => {
        refEle.removeEventListener("mouseenter", handleMouseOver);
        refEle.removeEventListener("mouseleave", handleMouseOut);
      };
    }
  }, [data.twitchVideoHoverEnable, handleMouseOut]);

  const handleMouseOverChannel = () => {
    setChannelIsHovered(true);
  };

  const handleMouseOutChannel = () => {
    setChannelIsHovered(false);
  };

  useEffect(() => {
    if (refChannel.current) {
      const refEle = refChannel.current;
      refChannel.current.addEventListener("mouseenter", handleMouseOverChannel);
      refChannel.current.addEventListener("mouseleave", handleMouseOutChannel);

      return () => {
        refEle.removeEventListener("mouseenter", handleMouseOverChannel);
        refEle.removeEventListener("mouseleave", handleMouseOutChannel);
      };
    }
  }, []);

  return (
    <div className={styles.video} key={data.data.id}>
      <HighlightAnimation data={data} REFRESH_RATE={data.REFRESH_RATE}></HighlightAnimation>
      <UnfollowAlert></UnfollowAlert>

      <ImageContainer id={data.data.id} ref={ref} style={{ marginTop: "5px" }}>
        {isHovered ? (
          <StreamHoverIframe
            id={data.data.id}
            data={data.data}
            setIsHovered={setIsHovered}></StreamHoverIframe>
        ) : null}
        <a
          className={styles.img}
          href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
          {/* href={
                "https://player.twitch.tv/?volume=0.1&!muted&channel=" +
                data.data.user_name.toLowerCase()
              }> */}
          <img
            src={
              // data.data.thumbnail_url.replace("{width}", 1280).replace("{height}", 720) +
              data.data.thumbnail_url.replace("{width}", 640).replace("{height}", 360) +
              `#` +
              new Date().getTime()
            }
            alt={styles.thumbnail}
          />
        </a>
        <Moment className={styles.duration} durationFromNow>
          {data.data.started_at}
        </Moment>
        {/* {streamType(data.data.type)} */}
      </ImageContainer>

      <OverlayTrigger
        key={"bottom"}
        placement={"bottom"}
        delay={{ show: 250, hide: 0 }}
        overlay={
          <Tooltip
            id={`tooltip-${"bottom"}`}
            style={{
              width: "336px",
            }}>
            {data.data.title}
          </Tooltip>
        }>
        <VideoTitle href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase()}>
          {Utilities.truncate(data.data.title, 50)}
        </VideoTitle>
      </OverlayTrigger>
      <div>
        <div className={styles.channelContainer} ref={refChannel}>
          <a
            href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos"}
            style={{ gridRow: 1 }}>
            <img src={data.data.profile_img_url} alt='' className={styles.profile_img}></img>
          </a>
          <p className={styles.channel}>
            <a href={"https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos"}>
              {data.data.user_name}
            </a>
          </p>
          {channelIsHovered ? (
            <OverlayTrigger
              key={"bottom"}
              placement={"bottom"}
              delay={0}
              overlay={
                <Tooltip id={`tooltip-${"bottom"}`}>
                  Unfollow <strong>{data.data.user_name}</strong>.
                </Tooltip>
              }>
              <UnfollowButton
                data-tip={"Unfollow " + data.data.user}
                variant='link'
                onClick={async () => {
                  await UnfollowStream({
                    user_id: data.data.user_id,
                    refresh: data.refresh,
                  })
                    .then(() => {
                      setUnfollowError("Successfully unfollowed");
                      data.refresh();
                    })
                    .catch(error => {
                      setUnfollowError(null);
                      setUnfollowError("Failed to unfollow");
                    });
                }}>
                <Icon icon={cross} size={18} className={styles.unfollowIcon} />
              </UnfollowButton>
            </OverlayTrigger>
          ) : null}
        </div>
        <div className={styles.gameContainer}>
          <a
            className={styles.game_img}
            href={"https://www.twitch.tv/directory/game/" + data.data.game_name}>
            <img
              src={data.data.game_img.replace("{width}", 130).replace("{height}", 173)}
              alt=''
              className={styles.game_img}></img>
          </a>
          <p className={styles.game}>
            <a href={"https://www.twitch.tv/directory/game/" + data.data.game_name}>
              {Utilities.truncate(data.data.game_name, 30)}
            </a>
          </p>
          <p className={styles.viewers}>
            {/* {data.data.viewer_count} */}
            {formatViewerNumbers(data.data.viewer_count)}
            <Icon
              icon={eye}
              size={14}
              style={{
                color: "rgb(200, 200, 200)",
                paddingLeft: "5px",
                paddingTop: "3px",
                display: "flex",
                alignItems: "center",
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

export default StreamEle;
