import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import axios from "axios";
import Utilities from "./../../../utilities/Utilities";
import ChannelListElement from "./ChannelListElement";
import AccountContext from "./../../account/AccountContext";
import StyledLoadingList from "./../LoadingList";

const channelList = async followedChannels => {
  const followedChannelsIds = await followedChannels.data.data.map(channel => {
    return channel.to_id;
  });

  return followedChannelsIds;
};

const RenderFollowedChannelList = data => {
  const [followedChannels, setFollowedChannels] = useState();
  const [vodChannels, setVodChannels] = useState();
  const streamMetadata = useRef();

  const { authKey, username } = useContext(AccountContext);

  const getChannels = useCallback(async () => {
    const monitoredChannels = await axios
      .get(
        `https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/monitored-channels/fetch`,
        {
          params: {
            username: username,
            authkey: authKey,
          },
        }
      )
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.error(err);
      });
    setVodChannels(monitoredChannels);
  }, [authKey, username]);

  const AddMetadata = useCallback(
    async followedChannels => {
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

      await getChannels();
      setFollowedChannels(followedChannels.data.data);
    },
    [getChannels]
  );

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
        console.log("Metadata cache used");

        streamMetadata.current = JSON.parse(localStorage.getItem("ChannelsMetadata"));
      }

      await AddMetadata(followedChannels);

      return "";
    };

    try {
      if (data.followedChannels.data) fetchProfileImages(data.followedChannels);
    } catch (error) {
      console.error(error);
    }
  }, [AddMetadata, data.followedChannels]);

  if (!followedChannels) {
    return <StyledLoadingList amount={12} />;
  } else {
    return (
      <ul>
        <p
          style={{
            textAlign: "center",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}>{`Total: ${followedChannels.length}`}</p>
        {followedChannels.map(channel => {
          return (
            <ChannelListElement
              key={channel.to_id}
              data={channel}
              vodChannels={vodChannels}
              setVodChannels={setVodChannels}
            />
          );
        })}
      </ul>
    );
  }
};

export default RenderFollowedChannelList;
