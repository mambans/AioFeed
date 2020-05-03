import { Link } from "react-router-dom";
import React from "react";

import FollowUnfollowBtn from "./../FollowUnfollowBtn";
import VodsFollowUnfollowBtn from "../vods/VodsFollowUnfollowBtn";
import { ChannelListLi } from "./StyledComponents";
import AddUpdateNotificationsButton from "./../AddUpdateNotificationsButton";

export default ({ data }) => {
  return (
    <ChannelListLi key={data.user_id}>
      <Link
        to={{
          pathname: `/${data.user_name.toLowerCase()}/channel/`,
          state: {
            p_id: data.user_id,
            p_logo: data.profile_img_url,
          },
        }}>
        {data.profile_img_url ? (
          <img src={data.profile_img_url} alt=''></img>
        ) : (
          <img src={`${process.env.PUBLIC_URL}/images/placeholder.jpg`} alt=''></img>
        )}
        {data.user_name}
      </Link>
      <div className='ButtonContianer'>
        <VodsFollowUnfollowBtn channel={data.user_name} />
        <AddUpdateNotificationsButton channel={data.user_name} />
        <FollowUnfollowBtn
          style={{ marginLeft: "5px", padding: "0" }}
          size={22}
          channelName={data.user_name}
          id={data.user_id}
          alreadyFollowedStatus={true}
        />
      </div>
    </ChannelListLi>
  );
};
