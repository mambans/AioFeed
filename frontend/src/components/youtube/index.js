import { TransitionGroup, CSSTransition } from "react-transition-group";
import React, { useRef, useState } from "react";
import { GrPowerReset } from "react-icons/gr";

import { SubFeedContainer } from "./../sharedStyledComponents";
import YoutubeVideoElement from "./YoutubeVideoElement";
import LoadingBoxes from "./../twitch/LoadingBoxes";
import { StyledLoadmore } from "./../twitch/StyledComponents";

export default (data) => {
  const { requestError, videos, videoElementsAmount } = data;
  const [vodAmounts, setVodAmounts] = useState({
    amount: videoElementsAmount || 14,
    timeout: 750,
    transitionGroup: "videos",
  });
  const loadmoreRef = useRef();
  const resetTransitionTimer = useRef();

  if (requestError && requestError.code === 401 && !videos) {
    return "";
  } else if (!videos || videos.length < 1) {
    return <LoadingBoxes amount={videoElementsAmount || 14} type='Vods' />;
  } else {
    return (
      <>
        <TransitionGroup
          className={vodAmounts.transitionGroup || "videos"}
          component={SubFeedContainer}>
          {videos.slice(0, vodAmounts.amount).map((video, index) => {
            return (
              <CSSTransition
                timeout={vodAmounts.timeout}
                classNames={index < videoElementsAmount ? "videoFadeSlide" : "fade-750ms"}
                key={video.contentDetails.upload.videoId}
                unmountOnExit>
                <YoutubeVideoElement id={video.contentDetails.upload.videoId} video={video} />
              </CSSTransition>
            );
          })}
        </TransitionGroup>

        <StyledLoadmore ref={loadmoreRef}>
          <div />
          <div
            id='Button'
            onClick={() => {
              if (vodAmounts.amount >= videos.length) {
                setVodAmounts({
                  amount: videoElementsAmount,
                  timeout: 0,
                  transitionGroup: "instant-disappear",
                });

                clearTimeout(resetTransitionTimer.current);
                resetTransitionTimer.current = setTimeout(() => {
                  setVodAmounts({
                    amount: videoElementsAmount,
                    timeout: 750,
                    transitionGroup: "videos",
                  });
                }, 750);
              } else {
                setVodAmounts((curr) => ({
                  amount: curr.amount + videoElementsAmount,
                  transition: "fade-750ms",
                  timeout: 750,
                  transitionGroup: "videos",
                }));
              }
              setTimeout(() => {
                if (loadmoreRef.current) {
                  loadmoreRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "nearest",
                  });
                }
              }, 0);
            }}>
            {vodAmounts.amount >= videos.length ? "Show less (reset)" : "Show more"}
          </div>
          <div />
          <GrPowerReset
            size={20}
            title='Show less (reset)'
            id='reset'
            onClick={() => {
              setVodAmounts({
                amount: videoElementsAmount,
                timeout: 0,
                transitionGroup: "instant-disappear",
              });
              clearTimeout(resetTransitionTimer.current);
              resetTransitionTimer.current = setTimeout(() => {
                setVodAmounts({
                  amount: videoElementsAmount,
                  timeout: 750,
                  transitionGroup: "videos",
                });
              }, 750);
            }}
          />
        </StyledLoadmore>
      </>
    );
  }
};
