import { cross } from "react-icons-kit/icomoon/cross";
import { ic_delete } from "react-icons-kit/md/ic_delete";
import { ic_playlist_add } from "react-icons-kit/md/ic_playlist_add";
import { Icon } from "react-icons-kit";
import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import React, { useState, useRef, useContext } from "react";

import { UnfollowButton, VodRemoveButton, VodAddButton } from "./../../sharedStyledComponents";
import AccountContext from "./../../account/AccountContext";
import UnfollowStream from "./../UnfollowStream";

const ChannelListElement = ({ data, vodChannels, setVodChannels }) => {
  const [unfollowResponse, setUnfollowResponse] = useState(null);
  const refUnfollowAlert = useRef();
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

  return (
    <li key={data.to_id}>
      <UnfollowAlert />
      <Link to={"/channel/" + data.to_name} style={{ padding: "0", fontSize: "unset" }}>
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
            data-tip={"Remove " + data.to_name + " vods."}
            title={"Remove " + data.to_name + " vods."}
            variant='link'
            onClick={() => {
              removeChannel(data.to_name);
            }}>
            <Icon icon={ic_delete} size={24} />
          </VodRemoveButton>
        ) : (
          <VodAddButton
            data-tip={"Add " + data.to_name + " vods."}
            title={"Add " + data.to_name + " vods."}
            variant='link'
            onClick={() => {
              addChannel(data.to_name);
            }}>
            <Icon icon={ic_playlist_add} size={26} />
          </VodAddButton>
        )}
        <UnfollowButton
          data-tip={"Unfollow " + data.to_name}
          title={"Unfollow " + data.to_name}
          variant='link'
          style={{ marginLeft: "5px", padding: "0" }}
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
      </div>
    </li>
  );
};

export default ChannelListElement;
