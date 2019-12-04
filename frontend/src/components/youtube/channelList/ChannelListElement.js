import React, { useState, useRef, useEffect } from "react";
import { Icon } from "react-icons-kit";
import { cross } from "react-icons-kit/icomoon/cross";
import { Animated } from "react-animated-css";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import _ from "lodash";

// import UnfollowStream from "./UnfollowStream";
import Utilities from "./../../../utilities/Utilities";
import { UnfollowButton } from "./../../sharedStyledComponents";

const UnfollowChannel = async subId => {
  const response = await axios
    .delete(`https://www.googleapis.com/youtube/v3/subscriptions`, {
      params: {
        id: subId,
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
      },
      headers: {
        Authorization: "Bearer " + Utilities.getCookie("Youtube-access_token"),
        Accept: "application/json",
      },
    })
    .then(res => {
      const followedChannels = JSON.parse(localStorage.getItem(`followedChannels`));

      _.remove(followedChannels.data, function(channel) {
        return channel.id === subId;
      });

      // setFollowedChannels(followedChannels.data);

      localStorage.setItem(
        `followedChannels`,
        JSON.stringify({
          data: followedChannels.data,
          casheExpire: followedChannels.casheExpire,
        })
      );

      return res;
    });

  return response;
};

const ChannelListElement = data => {
  const { channel } = data;
  const [unfollowResponse, setUnfollowResponse] = useState(null);
  const refUnfollowAlert = useRef();

  function UnfollowAlert(user) {
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
        <Animated
          animationIn='fadeInUp'
          animationOut='fadeOut'
          animationOutDelay={2000}
          animationOutDuration={2500}
          isVisible={false}
          style={{
            width: "200px",
            position: "absolute",
            margin: "0",
            height: "43px",
            marginTop: "10px",
          }}>
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
        </Animated>
      );
    } else {
      return "";
    }
  }

  useEffect(() => {
    return () => {
      clearTimeout(refUnfollowAlert.current);
    };
  }, []);

  return (
    <li key={channel.snippet.resourceId.ChanelId}>
      <UnfollowAlert user={channel.snippet.title}></UnfollowAlert>
      <a href={`https://www.youtube.com/channel/${channel.snippet.resourceId.channelId}`}>
        {channel.snippet.thumbnails.default.url ? (
          <img
            src={channel.snippet.thumbnails.default.url}
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
        {channel.snippet.title}
      </a>
      <UnfollowButton
        data-tip={"Unfollow " + channel.snippet.title}
        variant='link'
        onClick={async () => {
          await UnfollowChannel(channel.id)
            .then(res => {
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
