import React, { useState, useRef } from "react";
import { Icon } from "react-icons-kit";
import { cross } from "react-icons-kit/icomoon/cross";
import Alert from "react-bootstrap/Alert";

import UnfollowStream from "./../UnfollowStream";
import { UnfollowButton } from "./../../sharedStyledComponents";

const ChannelListElement = ({ data }) => {
  const [unfollowResponse, setUnfollowResponse] = useState(null);
  const refUnfollowAlert = useRef();

  function UnfollowAlert() {
    let alertText;
    if (unfollowResponse) {
      let alertType = "warning";
      if (unfollowResponse.includes("Failed")) {
        alertType = "warning";
        alertText = "Failed to Unfollow.";
      } else if (unfollowResponse.includes("Success")) {
        alertType = "success";
        alertText = "Successfully Unfollowed";
      }
      clearTimeout(refUnfollowAlert.current);
      refUnfollowAlert.current = setTimeout(() => {
        setUnfollowResponse(null);
      }, 6000);
      return (
        <Alert
          variant={alertType}
          style={{
            width: "200px",
            position: "absolute",
            // zIndex: "2",
            margin: "0",
            padding: "5px",
            borderRadius: "3px",
          }}
          className='unfollowResponseAlert'>
          <Alert.Heading
            style={{
              fontSize: "16px",
              textAlign: "center",
              marginBottom: "0",
            }}>
            {alertText}
          </Alert.Heading>
        </Alert>
      );
    } else {
      return "";
    }
  }

  return (
    <li key={data.to_id}>
      <UnfollowAlert />
      <a href={`https://www.twitch.tv/${data.to_name}/videos`}>
        {data.profile_image_url ? (
          <img
            src={data.profile_image_url}
            style={{
              width: "30px",
              height: "30px",
              marginRight: "10px",
              borderRadius: "3px",
            }}
            alt=''></img>
        ) : (
          <img
            src={`${process.env.PUBLIC_URL}/images/placeholder.png`}
            style={{
              width: "30px",
              height: "30px",
              marginRight: "10px",
              borderRadius: "3px",
            }}
            alt=''></img>
        )}
        {data.to_name}
      </a>
      <UnfollowButton
        data-tip={"Unfollow " + data.to_name}
        variant='link'
        onClick={async () => {
          await UnfollowStream({
            user_id: data.to_id,
            refresh: data.refresh,
          })
            .then(() => {
              setUnfollowResponse("Success");
            })
            .catch(error => {
              setUnfollowResponse(null);
              setUnfollowResponse("Failed");
            });
        }}>
        <Icon icon={cross} size={18} />
      </UnfollowButton>
    </li>
  );
};

export default ChannelListElement;
