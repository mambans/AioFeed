import React, { useState, useEffect, useContext } from "react";

import ChannelListElement from "./ChannelListElement";
import AccountContext from "./../../account/AccountContext";
import StyledLoadingList from "./../LoadingList";
import AddVideoExtraData from "./../AddVideoExtraData";

const RenderFollowedChannelList = data => {
  const [followedChannels, setFollowedChannels] = useState();
  const { authKey, username } = useContext(AccountContext);

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
            setFollowedChannels(res.data);
          });
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [data.followedChannels, username, authKey]);

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
          return <ChannelListElement key={channel.user_id} data={channel} />;
        })}
      </ul>
    );
  }
};

export default RenderFollowedChannelList;
