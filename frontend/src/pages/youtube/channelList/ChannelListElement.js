import React from 'react';
import { MdDelete } from 'react-icons/md';
import styled from 'styled-components';

import { getCookie } from './../../../util';
import { UnfollowButton } from './../../sharedComponents/sharedStyledComponents';
import UnfollowChannel from './unFollowChannel';
import ToolTip from '../../../components/tooltip/ToolTip';

const ChannelListLi = styled.li`
  position: relative;
  height: 42px;
  border-bottom: thin solid #1e1616;

  a {
    color: ${({ selected }) => (selected ? '#ffffff' : 'inherit')};
    font-weight: ${({ selected }) => (selected ? 'bold' : 'unset')};

    > img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      border-radius: 3px;
    }
  }
`;

const ChannelListElement = (data) => {
  const { channel, setNewChannels, videos, setVideos, selected } = data;

  const handleUnfollow = () => {
    UnfollowChannel({
      subscriptionId: channel.id,
      channelId: channel.snippet.resourceId.channelId,
      setChannels: setNewChannels,
      videos: videos,
      setVideos: setVideos,
    });
  };

  return (
    <ChannelListLi
      key={channel.snippet.title}
      className={selected ? 'selected' : ''}
      selected={selected}
    >
      <a href={`https://www.youtube.com/channel/${channel.snippet.resourceId.channelId}`}>
        {channel.snippet.thumbnails.default.url ? (
          <img src={channel.snippet.thumbnails.default.url} alt=''></img>
        ) : (
          <img src={`${process.env.PUBLIC_URL}/images/webp/placeholder.webp`} alt=''></img>
        )}
        {channel.snippet.title}
      </a>
      <ToolTip tooltip={`Unfollow ${channel.snippet.title}`}>
        <UnfollowButton
          disabled={getCookie('Youtube-readonly')}
          variant='link'
          onClick={handleUnfollow}
        >
          <MdDelete size={18} />
        </UnfollowButton>
      </ToolTip>
    </ChannelListLi>
  );
};

export default ChannelListElement;
