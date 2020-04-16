import React from "react";

import StyledLoadingList from "./../../twitch/LoadingList";
import ChannelListElement from "./ChannelListElement";

export default (data) => {
  if (!data.followedChannels) {
    return <StyledLoadingList amount={12} />;
  } else {
    return (
      <ul>
        <p
          style={{
            textAlign: "center",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}>{`Total: ${data.followedChannels.length}`}</p>
        {data.followedChannels.map((channel) => {
          return (
            <ChannelListElement
              channel={channel}
              key={channel.snippet.resourceId.channelId}></ChannelListElement>
          );
        })}
      </ul>
    );
  }
};
