import { MdVideoCall } from "react-icons/md";
import { MdVideocamOff } from "react-icons/md";
import { MdVideocam } from "react-icons/md";
import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import React, { useState, useRef, useContext, useEffect } from "react";

import { VodRemoveButton, VodAddButton } from "./../../sharedStyledComponents";
import AccountContext from "./../../account/AccountContext";

import FollowUnfollowBtn from "./../FollowUnfollowBtn";

const ChannelListElement = ({ data, vodChannels, setVodChannels }) => {
  const [unfollowResponse, setUnfollowResponse] = useState(null);
  const [isHovered, setIsHovered] = useState();
  const refUnfollowAlert = useRef();
  const vodButton = useRef();
  const { authKey, username } = useContext(AccountContext);

  async function addChannel(channel) {
    try {
      vodChannels.unshift(channel.toLowerCase());
      setVodChannels([...vodChannels]);

      await axios
        .put(
          `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/update`,
          {
            username: username,
            authkey: authKey,
            channels: vodChannels,
          }
        )
        .catch(error => {
          console.error(error);
        });
    } catch (e) {
      console.log(e.message);
    }
  }

  async function removeChannel(channel) {
    try {
      const index = vodChannels.indexOf(channel.toLowerCase());
      vodChannels.splice(index, 1);
      setVodChannels([...vodChannels]);

      await axios
        .put(
          `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/update`,
          {
            username: username,
            authkey: authKey,
            channels: vodChannels,
          }
        )
        .catch(err => {
          console.error(err);
        });
    } catch (e) {
      console.log(e.message);
    }
  }

  const ChannelVodEnabled = () => {
    return vodChannels.includes(data.to_name.toLowerCase());
  };

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

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    if (vodButton.current) {
      const refEle = vodButton.current;
      refEle.addEventListener("mouseenter", handleMouseOver);
      refEle.addEventListener("mouseleave", handleMouseOut);

      return () => {
        refEle.removeEventListener("mouseenter", handleMouseOver);
        refEle.removeEventListener("mouseleave", handleMouseOut);
      };
    }
  }, []);

  return (
    <li key={data.to_id}>
      <UnfollowAlert />
      <Link
        to={{
          pathname: "/channel/" + data.to_name.toLowerCase(),
          state: {
            p_id: data.to_id,
            p_logo: data.profile_image_url,
          },
        }}
        style={{ padding: "0", fontSize: "unset" }}>
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
            src={`${process.env.PUBLIC_URL}/images/placeholder.jpg`}
            style={{
              width: "30px",
              height: "30px",
              marginRight: "10px",
              borderRadius: "3px",
            }}
            alt=''></img>
        )}
        {data.to_name}
      </Link>
      <div>
        {ChannelVodEnabled() ? (
          <VodRemoveButton
            ref={vodButton}
            data-tip={"Remove " + data.to_name + " vods."}
            title={"Remove " + data.to_name + " vods."}
            variant='link'
            onClick={() => {
              removeChannel(data.to_name);
            }}>
            {isHovered ? (
              <MdVideocamOff size={24} color='red' />
            ) : (
              <MdVideocam size={24} color='green' />
            )}
          </VodRemoveButton>
        ) : (
          <VodAddButton
            ref={vodButton}
            data-tip={"Add " + data.to_name + " vods."}
            title={"Add " + data.to_name + " vods."}
            variant='link'
            onClick={() => {
              addChannel(data.to_name);
            }}>
            <MdVideoCall size={24} />
          </VodAddButton>
        )}
        <FollowUnfollowBtn
          style={{ marginLeft: "5px", padding: "0" }}
          size={22}
          channelName={data.to_name}
          id={data.to_id}
          alreadyFollowedStatus={true}
        />
      </div>
    </li>
  );
};

export default ChannelListElement;
