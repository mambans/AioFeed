import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import Utilities from "./../../../utilities/Utilities";

import ChannelListElement from "./ChannelListElement";

const channelList = async followedChannels => {
  const followedChannelsIds = await followedChannels.data.data.map(channel => {
    return channel.to_id;
  });

  return followedChannelsIds;
};

const RenderFollowedChannelList = data => {
  const [followedChannels, setFollowedChannels] = useState();
  const streamMetadata = useRef();

  const AddMetadata = useCallback(async followedChannels => {
    try {
      followedChannels.data.data.map(stream => {
        if (
          streamMetadata.current.find(channel => {
            return channel.id === stream.to_id;
          })
        ) {
          stream.profile_image_url = streamMetadata.current.find(channel => {
            return channel.id === stream.to_id;
          }).profile_image_url;
        }

        return "";
      });
    } catch (error) {
      console.error(error);
    }

    setFollowedChannels(followedChannels.data.data);
  }, []);

  useEffect(() => {
    const fetchProfileImages = async followedChannels => {
      if (
        !localStorage.getItem("ChannelsMetadata") ||
        JSON.parse(localStorage.getItem("ChannelsMetadata")).length !==
          followedChannels.data.data.length
      ) {
        console.log("Metadata request sent");

        const followedChannelsIds = await channelList(followedChannels);

        const res = await axios.get(`https://api.twitch.tv/helix/users`, {
          params: {
            id: followedChannelsIds,
            first: 100,
          },
          headers: {
            Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          },
        });

        streamMetadata.current = res.data.data;

        localStorage.setItem(`ChannelsMetadata`, JSON.stringify(streamMetadata.current));
      } else {
        console.log("Metadeta cache used");

        streamMetadata.current = JSON.parse(localStorage.getItem("ChannelsMetadata"));
      }

      await AddMetadata(followedChannels);

      return "";
    };

    try {
      fetchProfileImages(data.followedChannels);
    } catch (error) {
      console.error(error);
    }
  }, [AddMetadata, data.followedChannels]);

  if (!followedChannels) {
    return (
      <Spinner animation='grow' role='status' style={Utilities.loadingSpinner} variant='light'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  } else {
    return (
      <ul>
        {followedChannels.map(channel => {
          return <ChannelListElement data={channel} key={channel.to_id}></ChannelListElement>;
        })}
        <p
          style={{
            textAlign: "center",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}>{`Total: ${followedChannels.length}`}</p>
      </ul>
    );
  }
};

export default RenderFollowedChannelList;
