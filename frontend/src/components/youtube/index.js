import { TransitionGroup, CSSTransition } from "react-transition-group";
import React, { useRef, useState, useEffect } from "react";

import { SubFeedContainer } from "./../sharedStyledComponents";
import YoutubeVideoElement from "./YoutubeVideoElement";
import LoadingBoxes from "./../twitch/LoadingBoxes";
import { StyledLoadmore } from "./../twitch/StyledComponents";

export default (data) => {
  const { requestError, videos, centerContainerRef } = data;
  const [numberOfVideos, setNumberOfVideos] = useState(
    centerContainerRef ? Math.floor((centerContainerRef.clientWidth / 350) * 2) : 14
  );
  const [vodAmounts, setVodAmounts] = useState(numberOfVideos);
  const loadmoreRef = useRef();

  useEffect(() => {
    if (centerContainerRef) {
      setNumberOfVideos(Math.floor((centerContainerRef.clientWidth / 350) * 2));
    }
  }, [centerContainerRef]);

  if (requestError && requestError.code === 401 && !videos) {
    return "";
  } else if (!videos || videos.length < 1) {
    return (
      <LoadingBoxes
        amount={centerContainerRef ? Math.floor((centerContainerRef.clientWidth / 350) * 1.5) : 11}
        type='Vods'
      />
    );
  } else {
    return (
      <>
        <SubFeedContainer>
          <TransitionGroup className='youtube' component={null}>
            {videos.slice(0, vodAmounts).map((video) => {
              return (
                <CSSTransition
                  timeout={1000}
                  classNames='videoFadeSlide'
                  key={video.contentDetails.upload.videoId}
                  unmountOnExit>
                  <YoutubeVideoElement id={video.contentDetails.upload.videoId} video={video} />
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
            }}>
            Show more
          </div>
          <div />
        </StyledLoadmore>
      </>
    );
  }
};
