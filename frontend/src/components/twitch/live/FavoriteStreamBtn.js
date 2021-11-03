import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { MdStar, MdStarBorder } from 'react-icons/md';
import ToolTip from '../../sharedComponents/ToolTip';
import { VodAddRemoveButton } from '../../sharedComponents/sharedStyledComponents';
import API from '../../navigation/API';
import { TwitchContext } from '../useToken';

const AddItemBtn = styled(MdStarBorder)`
  transition: color 250ms;

  &:hover {
    color: rgb(255, 255, 0);
  }
`;

const RemoveItemBtn = styled(MdStar)`
  transition: color 250ms;
  color: rgb(255, 255, 0);

  &:hover {
    color: rgb(100, 100, 100);
  }
`;

const AddedItemBtn = styled(MdStar)`
  transition: color 250ms;
  color: rgb(255, 255, 0);
`;

const FavoriteStreamBtn = (
  { channel, size = '1.4em', loweropacity, marginright, show = true, style },
  ...props
) => {
  const { favStreams, setFavStreams } = useContext(TwitchContext);
  const [isHovered, setIsHovered] = useState();
  const added = favStreams?.includes(channel?.toLowerCase());

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(null);

  async function addChannel() {
    try {
      const existing = new Set(favStreams || []);
      const newChannels = [...existing.add(channel?.toLowerCase())];

      setFavStreams(newChannels);

      await API.updateFavoriteStreams(newChannels);
    } catch (error) {
      console.log('error', error);
    }
  }

  async function removeChannel() {
    try {
      const existing = new Set(favStreams || []);
      existing.delete(channel?.toLowerCase());
      const newChannels = [...existing];

      setFavStreams(newChannels);

      await API.updateFavoriteStreams(newChannels);
    } catch (error) {
      console.log('error', error);
    }
  }

  if (!show) return null;

  return (
    <ToolTip
      delay={{ show: 500, hide: 0 }}
      width='max-content'
      tooltip={`${added ? 'Remove' : 'Add'} ${channel} as a favorite.`}
    >
      <VodAddRemoveButton
        className='StreamUpdateNoitificationsButton'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        marginright={marginright}
        loweropacity={loweropacity}
        vodenabled={show.toString()}
        variant='link'
        onClick={added ? removeChannel : addChannel}
        style={style}
      >
        {added ? (
          isHovered ? (
            <RemoveItemBtn size={size} />
          ) : (
            <AddedItemBtn size={size} />
          )
        ) : (
          <AddItemBtn size={size} />
        )}
      </VodAddRemoveButton>
    </ToolTip>
  );
};

export default FavoriteStreamBtn;
