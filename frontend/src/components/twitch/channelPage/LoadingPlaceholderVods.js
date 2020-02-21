import React from "react";

import { SubFeedContainer } from "./../../sharedStyledComponents";
import LoadingBoxs from "./../LoadingBoxs";
import SortButton from "./SortButton";
import { SubFeedHeader } from "./StyledComponents";

export default ({ numberOfVideos }) => {
  return (
    <>
      <SubFeedHeader
        style={{
          width: `${numberOfVideos * 350}px`,
        }}>
        <SortButton sortBy={""} />
        <h3>Vods</h3>
      </SubFeedHeader>
      <SubFeedContainer
        style={{ justifyContent: "center", minHeight: "345px", paddingBottom: "0" }}>
        <LoadingBoxs amount={numberOfVideos} type='Vods' />
      </SubFeedContainer>
    </>
  );
};
