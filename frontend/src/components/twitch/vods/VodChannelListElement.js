import React from "react";
import { Link } from "react-router-dom";

import VodsFollowUnfollowBtn from "./VodsFollowUnfollowBtn";
import { VodChannelListLi } from "./StyledComponents";

export default ({ channel }) => {
  return (
    <VodChannelListLi>
      <Link to={"/channel/" + channel}>{channel}</Link>
      <VodsFollowUnfollowBtn channel={channel} />
    </VodChannelListLi>
  );
};
