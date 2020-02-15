import React from "react";

import { SubFeedContainer } from "./../../sharedStyledComponents";
import LoadingBoxs from "./../LoadingBoxs";
import { SubFeedHeader } from "./StyledComponents";

export default ({ numberOfVideos }) => {
  return (
    <>
      <SubFeedHeader
        style={{
          margin: "50px auto 10px auto",
          borderBottom: "1px solid grey",
          width: `${numberOfVideos * 350}px`,
        }}>
        <h3>Clips</h3>
      </SubFeedHeader>

      <SubFeedContainer
        style={{ justifyContent: "center", minHeight: "310px", paddingBottom: "0" }}>
        <LoadingBoxs amount={numberOfVideos} type='Clips' />
      </SubFeedContainer>
    </>
  );
};
