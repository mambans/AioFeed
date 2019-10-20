import React, { useEffect, useCallback, useRef } from "react";
// import ReactTooltip from "react-tooltip";
import logo from "../../assets/images/logo-v2.png";
import StreamEle from "./StreamElement.js";
import Utilities from "../../utilities/Utilities";

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
            icon: data.data.profile_img_url || logo,
            badge: data.data.profile_img_url || logo,
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
      {/* <ReactTooltip delayShow={150} place='bottom' type='dark' effect='solid' /> */}
      {data.newlyAdded ? (
        <StreamEle
          key={data.data.id}
          data={data.data}
          newlyAddedStreams={data.newlyAddedStreams}
          newlyAdded={data.newlyAdded}
          refresh={data.refresh}
        />
      ) : (
        <StreamEle
          key={data.data.id}
          data={data.data}
          newlyAddedStreams={data.newlyAddedStreams}
          newlyAdded={data.newlyAdded}
          refresh={data.refresh}
        />
      )}
    </>
  );
}

export default RenderTwitch;
