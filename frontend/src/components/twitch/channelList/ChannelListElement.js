import { Link } from "react-router-dom";
import React from "react";

import FollowUnfollowBtn from "./../FollowUnfollowBtn";
import VodsFollowUnfollowBtn from "../vods/VodsFollowUnfollowBtn";

const ChannelListElement = ({ data }) => {
  return (
    <li key={data.user_id}>
      <Link
        to={{
          pathname: "/channel/" + data.user_name.toLowerCase(),
          state: {
            p_id: data.user_id,
            p_logo: data.profile_img_url,
          },
        }}
        style={{ padding: "0", fontSize: "unset" }}>
        {data.profile_img_url ? (
          <img
            src={data.profile_img_url}
            style={{
              width: "30px",
              height: "30px",
              marginRight: "10px",
              borderRadius: "3px",
            }}
            alt=''></img>
        ) : (
          <img
            src={`${process.env.PUBLIC_URL}/images/placeholder.jpg`}
            style={{
              width: "30px",
              height: "30px",
              marginRight: "10px",
              borderRadius: "3px",
            }}
            alt=''></img>
        )}
        {data.user_name}
      </Link>
      <div>
        <VodsFollowUnfollowBtn channel={data.user_name} />

        <FollowUnfollowBtn
          style={{ marginLeft: "5px", padding: "0" }}
          size={22}
          channelName={data.user_name}
          id={data.user_id}
          alreadyFollowedStatus={true}
        />
      </div>
    </li>
  );
};

export default ChannelListElement;
