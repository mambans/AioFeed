import React, { useContext } from 'react';
import styled from 'styled-components';

import { RemoveItemFromCurrentListIcon } from '../StyledComponents';
import {
  mouseLeaveEnablePreview,
  mouseOverDisablePreview,
  removeFavoriteVideo,
} from './AddToListModal';
import { TransparentButton } from '../../../components/styledComponents';
import MyListsContext from '../MyListsContext';

export const TransparentRemoveFromCurrentListButton = styled(TransparentButton)`
  transition: opacity 250ms, color 250ms;
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(50%, -50%);
  opacity: 0;

  &:hover {
    opacity: 1;
  }
`;

const RemoveFromCurrentListButton = ({ videoId_p, size = 24, disablepreview = () => {}, list }) => {
  const videoId = typeof videoId_p === 'number' ? parseInt(videoId_p) || videoId_p : videoId_p;
  const { setLists } = useContext(MyListsContext) || {};

  const handleClick = () => {
    removeFavoriteVideo({ setLists, id: list?.id, videoId });
  };

  const handleMouseOver = () => {
    disablepreview();
    mouseOverDisablePreview();
  };

  if (!list) return null;

  return (
    <TransparentRemoveFromCurrentListButton
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseLeave={mouseLeaveEnablePreview}
    >
      <RemoveItemFromCurrentListIcon size={size} />
    </TransparentRemoveFromCurrentListButton>
  );
};

export default RemoveFromCurrentListButton;
