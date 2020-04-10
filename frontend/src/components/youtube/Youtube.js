import { Spinner } from "react-bootstrap";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import React, { useRef } from "react";

import { SubFeedContainer } from "./../sharedStyledComponents";
import Util from "../../util/Util";
import YoutubeVideoElement from "./YoutubeVideoElement";

export default (data) => {
  const transition = useRef("fade-1s");

  if (data.requestError && data.requestError.code === 401 && !data.videos) {
    return "";
  } else if (!data.initiated || !data.videos || data.videos.length < 1) {
    return (
      <Spinner animation='grow' role='status' id='asd' style={Util.loadingSpinner} variant='light'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  } else {
    console.log("RENDERING YOUTUBE VIDEOS");
    return (
      <SubFeedContainer>
        <TransitionGroup className='twitch-vods' component={null}>
          {data.videos.map((video) => {
            return (
              <CSSTransition
                timeout={1000}
                // classNames='videoFade-1s'
                classNames={transition.current}
                key={video.contentDetails.upload.videoId}
                unmountOnExit>
                <YoutubeVideoElement
                  id={video.contentDetails.upload.videoId}
                  video={video}
                  transition={transition.current}
                  setTransition={() => {
                    transition.current = "videoFade-1s";
                  }}
                />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </SubFeedContainer>
    );
  }
};
