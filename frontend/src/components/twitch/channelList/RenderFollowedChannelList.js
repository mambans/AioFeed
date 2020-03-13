import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";

import ChannelListElement from "./ChannelListElement";
import AccountContext from "./../../account/AccountContext";
import StyledLoadingList from "./../LoadingList";
import AddVideoExtraData from "./../AddVideoExtraData";

const RenderFollowedChannelList = data => {
  const [followedChannels, setFollowedChannels] = useState();
  const [vodChannels, setVodChannels] = useState([]);

  const { authKey, username } = useContext(AccountContext);

  const getChannels = useCallback(async () => {
    await axios
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
        setVodChannels(res.data);
        return res.data;
      })
      .catch(err => {
        console.error(err);
      });
  }, [authKey, username]);

  useEffect(() => {
    const channelObjectList = async followedChannels => {
      const followedChannelsIds = {
        data: {
          data: await followedChannels.map(channel => {
            return { user_id: channel.to_id, user_name: channel.to_name };
          }),
        },
      };

      return followedChannelsIds;
    };

    try {
      if (data.followedChannels) {
        channelObjectList(data.followedChannels).then(async res => {
          await AddVideoExtraData(res, false).then(async res => {
            await getChannels();
            setFollowedChannels(res.data);
          });
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [data.followedChannels, getChannels]);

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
              key={channel.user_id}
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
