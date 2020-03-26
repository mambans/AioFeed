import React from "react";
import { Spinner } from "react-bootstrap";

import Util from "./../../../util/Util";
import ChannelListElement from "./ChannelListElement";

export default data => {
  if (!data.followedChannels) {
    return (
      <Spinner animation='grow' role='status' style={Util.loadingSpinner} variant='light'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  } else {
    return (
      <ul>
        <p
          style={{
            textAlign: "center",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}>{`Total: ${data.followedChannels.length}`}</p>
        {data.followedChannels.map(channel => {
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
