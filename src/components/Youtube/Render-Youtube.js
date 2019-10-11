import { Animated } from "react-animated-css";
import React, { useEffect, useRef, useState } from "react";
import { store } from "react-notifications-component";
import ReactTooltip from "react-tooltip";

import YoutubeVideoElement from "./YoutubeVideoElement";
import Utilities from "utilities/Utilities";

function RenderYoutube(data) {
  const videoData = useRef();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    function addNotification(type) {
      store.addNotification({
        title: data.data.snippet.channelTitle,
        message: `${Utilities.truncate(data.data.snippet.title, 50)}`,
        content: (
          <div className={`notification-custom-${type}`}>
            <div className='notification-custom-icon'>
              <img
                src={data.data.snippet.thumbnails.medium.url}
                alt=''
                className={"youtube-notificationProfileIcon"}></img>
            </div>
            <div className='notification-custom-content'>
              <p className='notification-title'>{data.data.snippet.channelTitle}</p>
              <p className='notification-message'>
                {Utilities.truncate(data.data.snippet.title, 50)}
              </p>
              <p className='notification-duration'>{data.data.duration}</p>
            </div>
          </div>
        ),
        width: 450,
        insert: "top",
        container: "bottom-right",
        animationIn: ["animated", "slideInRight"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 7500,
        },
      });
    }

    if (
      (videoData.current === undefined ||
        videoData.current.contentDetails.upload.videoId !==
          data.data.contentDetails.upload.videoId) &&
      !data.run.initial
    ) {
      setAnimate(true);
      addNotification("youtube-new-video");
    }
    videoData.current = data.data;
    data.runChange(false);
  }, [data]);

  return (
    <>
      <ReactTooltip delayShow={250} place='bottom' type='dark' effect='solid' />
      {animate ? (
        <Animated animationIn='zoomIn' animationOut='fadeOut' isVisible={true}>
          <YoutubeVideoElement
            data={data.data}
            // isHovered={isHovered}
            // setIsHovered={setIsHovered}
          ></YoutubeVideoElement>
        </Animated>
      ) : (
        <YoutubeVideoElement
          data={data.data}
          // isHovered={isHovered}
          // setIsHovered={setIsHovered}
        ></YoutubeVideoElement>
      )}
    </>
  );
}

export default RenderYoutube;
