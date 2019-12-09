import { Animated } from "react-animated-css";
import React, { useEffect, useRef } from "react";

import FeedsContext from "./../feed/FeedsContext";
import StreamEle from "./StreamElement.js";

function RenderTwitch(data) {
  const streamData = useRef();

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
  }, [data.data, data.run.initial]);

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
