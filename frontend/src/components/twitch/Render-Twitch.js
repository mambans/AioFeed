import React, { useEffect, useCallback, useRef } from "react";
import { Animated } from "react-animated-css";

import StreamEle from "./StreamElement.js";
import Utilities from "../../utilities/Utilities";

import FeedsContext from "./../feed/FeedsContext";

function RenderTwitch(data) {
  const streamData = useRef();

  const addSystemNotification = useCallback(
    status => {
      if (Notification.permission === "granted") {
        let notification = new Notification(
          `${data.data.user_name} ${status === "offline" ? "Offline" : "Live"}`,
          {
            body:
              status === "offline"
                ? ""
                : `${Utilities.truncate(data.data.title, 60)}\n${data.data.game_name}`,
            icon: data.data.profile_img_url || `${process.env.PUBLIC_URL}/icons/v3/Logo-4k.png`,
            badge:
              data.data.profile_img_url || `${process.env.PUBLIC_URL}/icons/v3/Logo-4k.png`,
          }
        );

        notification.onclick = function(event) {
          event.preventDefault();
          status === "offline"
            ? window.open(
                "https://www.twitch.tv/" + data.data.user_name.toLowerCase() + "/videos",
                "_blank"
              )
            : window.open("https://www.twitch.tv/" + data.data.user_name.toLowerCase(), "_blank");
        };

        return notification;
      }
    },
    [data.data.game_name, data.data.profile_img_url, data.data.title, data.data.user_name]
  );

  useEffect(() => {
    if (
      (streamData.current === undefined || streamData.current.id !== data.data.id) &&
      !data.run.initial
    ) {
      streamData.current = data.data;
    } else if (
      streamData.current === undefined ||
      streamData.current.game_id !== data.data.game_id ||
      streamData.current.title !== data.data.title
    ) {
      streamData.current = data.data;
    }
    streamData.current = data.data;
  }, [addSystemNotification, data, data.data, data.data.id]);

  return (
    <>
      <FeedsContext.Consumer>
        {feedProps => {
          return data.newlyAdded ? (
            <Animated
              animationIn='fadeIn'
              animationOut='fadeOut'
              isVisible={true}
              key={data.data.id}>
              <StreamEle
                {...feedProps}
                key={data.data.id}
                data={data.data}
                newlyAddedStreams={data.newlyAddedStreams}
                newlyAdded={data.newlyAdded}
                refresh={data.refresh}
                REFRESH_RATE={data.REFRESH_RATE}
              />
            </Animated>
          ) : (
            <StreamEle
              {...feedProps}
              key={data.data.id}
              data={data.data}
              newlyAddedStreams={data.newlyAddedStreams}
              newlyAdded={data.newlyAdded}
              refresh={data.refresh}
              REFRESH_RATE={data.REFRESH_RATE}
            />
          );
        }}
      </FeedsContext.Consumer>
    </>
  );
}

export default RenderTwitch;
