import React from "react";
import { MdDelete } from "react-icons/md";
import styled from "styled-components";

import { getCookie } from "./../../../util/Utils";
import { UnfollowButton } from "./../../sharedStyledComponents";
import UnfollowChannel from "./unFollowChannel";

const ChannelListLi = styled.li`
  position: relative;
  height: 42px;
  border-bottom: thin solid #1e1616;

  a {
    color: ${({ selected }) => (selected ? "#ffffff" : "inherit")};
    font-weight: ${({ selected }) => (selected ? "bold" : "unset")};
  }
`;

export default (data) => {
  const { channel, setNewChannels, videos, setVideos, selected } = data;

  return (
    <ChannelListLi
      key={channel.snippet.resourceId.channelId}
      className={selected ? "selected" : ""}
      selected={selected}>
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
            src={`${process.env.PUBLIC_URL}/images/placeholder.webp`}
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
        disabled={getCookie("Youtube-readonly")}
        title={"Unfollow " + channel.snippet.title}
        variant='link'
        onClick={async () => {
          await UnfollowChannel({
            subscriptionId: channel.id,
            channelId: channel.snippet.resourceId.channelId,
            setChannels: setNewChannels,
            videos: videos,
            setVideos: setVideos,
          });
        }}>
        <MdDelete size={18} />
      </UnfollowButton>
    </ChannelListLi>
  );
};
