import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MdStar, MdStarBorder } from 'react-icons/md';
import ToolTip from '../../../components/tooltip/ToolTip';
import { VodAddRemoveButton } from '../../sharedComponents/sharedStyledComponents';
import API from '../../navigation/API';
import { TwitchContext } from '../useToken';

const AddItemBtn = styled(MdStarBorder)`
  transition: color 250ms;
`;

const AddedItemBtn = styled(MdStar)`
  transition: color 250ms;
`;

const FavoriteStreamBtn = (
  { id, channel, size = '1.4em', loweropacity, marginright, show = true, style },
  ...props
) => {
  const { favStreams, setFavStreams } = useContext(TwitchContext);
  const [enabled, setEnabled] = useState(favStreams?.includes(id));

  async function addChannel() {
    try {
      const existing = new Set(favStreams || []);
      const newChannels = [...existing.add(id)];

      setFavStreams(newChannels);

      await API.updateFavoriteStreams(newChannels);
    } catch (error) {
      console.log('error', error);
    }
  }

  async function removeChannel() {
    try {
      const existing = new Set(favStreams || []);
      existing.delete(id);
      const newChannels = [...existing];

      setFavStreams(newChannels);

      await API.updateFavoriteStreams(newChannels);
    } catch (error) {
      console.log('error', error);
    }
  }

  useEffect(() => {
    setEnabled(favStreams?.includes(id));
  }, [favStreams, id]);

  const handleOnClick = () => {
    setEnabled((c) => !c);
    if (enabled) {
      removeChannel();
    } else {
      addChannel();
    }
  };

  if (!show) return null;

  return (
    <ToolTip
      delay={{ show: 500, hide: 0 }}
      width='max-content'
      tooltip={`${enabled ? 'Remove' : 'Add'} ${channel} as a favorite.`}
    >
      <VodAddRemoveButton
        className='StreamUpdateNoitificationsButton'
        marginright={marginright}
        loweropacity={loweropacity}
        vodenabled={String(enabled)}
        variant='link'
        onClick={handleOnClick}
        style={style}
      >
        {enabled ? <AddedItemBtn size={size} /> : <AddItemBtn size={size} />}
      </VodAddRemoveButton>
    </ToolTip>
  );
};

export default FavoriteStreamBtn;
