import React, { useState, useRef, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { remove } from "lodash";

// import UnfollowStream from "./UnfollowStream";
import Util from "./../../../util/Util";
import { UnfollowButton } from "./../../sharedStyledComponents";

const UnfollowChannel = async (subId) => {
  const response = await axios
    .delete(`https://www.googleapis.com/youtube/v3/subscriptions`, {
      params: {
        id: subId,
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
      },
      headers: {
        Authorization: "Bearer " + Util.getCookie("Youtube-access_token"),
        Accept: "application/json",
      },
    })
    .then((res) => {
      const followedChannels = JSON.parse(localStorage.getItem(`YT-followedChannels`));

      remove(followedChannels.data, function (channel) {
        return channel.id === subId;
      });

      // setFollowedChannels(followedChannels.data);

      localStorage.setItem(
        `YT-followedChannels`,
        JSON.stringify({
          data: followedChannels.data,
          casheExpire: followedChannels.casheExpire,
        })
      );

      return res;
    });

  return response;
};

const ChannelListElement = (data) => {
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
            src={`${process.env.PUBLIC_URL}/images/placeholder.jpg`}
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
        disabled={Util.getCookie("Youtube-readonly")}
        data-tip={"Unfollow " + channel.snippet.title}
        variant='link'
        onClick={async () => {
          await UnfollowChannel(channel.id)
            .then((res) => {
              setUnfollowResponse("Success");
            })
            .catch((error) => {
              setUnfollowResponse(null);
              setUnfollowResponse("Failed");
            });
        }}>
        <MdDelete size={18} />
      </UnfollowButton>
    </li>
  );
};

export default ChannelListElement;
