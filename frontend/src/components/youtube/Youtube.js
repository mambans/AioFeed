import { Animated } from "react-animated-css";
import React from "react";
import { Spinner } from "react-bootstrap";
import LazyLoad from "react-lazyload";
// import RenderYoutube from "./Render-Youtube";
import Utilities from "../../utilities/Utilities";
import { SubFeedContainer } from "./../sharedStyledComponents";

import YoutubeVideoElement from "./YoutubeVideoElement";

export default data => {
  if (data.requestError && data.requestError.code === 401) {
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
        {data.videos.map(video => {
          return (
            <LazyLoad key={video.contentDetails.upload.videoId} height={312} offset={25} once>
              <Animated animationIn='fadeIn' animationOut='fadeOut' isVisible={true}>
                <YoutubeVideoElement id={video.contentDetails.upload.videoId} video={video} />
                {/* <RenderYoutube
                  id={video.contentDetails.upload.videoId}
                  video={video}
                  run={{ initial: data.initialOpen }}
                  runChange={data.onChange}
                /> */}
              </Animated>
            </LazyLoad>
          );
        })}
      </SubFeedContainer>
    );
  }
};
