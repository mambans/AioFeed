import React from "react";
import { Spinner } from "react-bootstrap";

import Utilities from "./../../../utilities/Utilities";
import ChannelListElement from "./ChannelListElement";

const RenderFollowedChannelList = data => {
  if (!data.followedChannels) {
    return (
      <Spinner animation='grow' role='status' style={Utilities.loadingSpinner} variant='light'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  } else {
    return (
      <ul>
        {data.followedChannels.map(channel => {
          return (
            <ChannelListElement
              channel={channel}
              key={channel.snippet.resourceId.channelId}></ChannelListElement>
          );
        })}
        <p
          style={{
            textAlign: "center",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}>{`Total: ${data.followedChannels.length}`}</p>
      </ul>
    );
  }
};

export default RenderFollowedChannelList;
