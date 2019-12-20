import React, { useRef } from "react";
import { Spinner } from "react-bootstrap";
import LazyLoad from "react-lazyload";
import Utilities from "../../utilities/Utilities";
import { SubFeedContainer } from "./../sharedStyledComponents";

import YoutubeVideoElement from "./YoutubeVideoElement";
import { TransitionGroup, CSSTransition } from "react-transition-group";

export default data => {
  const transition = useRef("fade-1s");

  if (data.requestError && data.requestError.code === 401 && !data.videos) {
    return "";
  } else if (!data.initiated || !data.videos || data.videos.length < 1) {
    return (
      <Spinner
        animation='grow'
        role='status'
        id='asd'
        style={Utilities.loadingSpinner}
        variant='light'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  } else {
    console.log("RENDERING YOUTUBE VIDEOS");
    return (
      <SubFeedContainer>
        <TransitionGroup className='twitch-vods' component={null}>
          {data.videos.map(video => {
            return (
              <LazyLoad key={video.contentDetails.upload.videoId} height={312} offset={25} once>
                <CSSTransition
                  in={true}
                  timeout={1000}
                  // classNames='videoFade-1s'
                  classNames={transition.current}
                  key={video.contentDetails.upload.videoId}
                  unmountOnExit>
                  <YoutubeVideoElement id={video.contentDetails.upload.videoId} video={video} />
                </CSSTransition>
              </LazyLoad>
            );
          })}
          {(transition.current = "videoFade-1s")}
        </TransitionGroup>
      </SubFeedContainer>
    );
  }
};
