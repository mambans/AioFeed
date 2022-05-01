import React, { useContext, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { AddedItemBtn, AddItemBtn, ButtonContainer, IconContainer } from '../StyledComponents';
import AddToListModal, { mouseLeaveEnablePreview, mouseOverDisablePreview } from './AddToListModal';
import useClicksOutside from '../../../hooks/useClicksOutside';
import FeedsContext from '../../feed/FeedsContext';

const AddToListButton = ({
  list,
  videoId_p,
  style = {},
  size = 24,
  disablepreview = () => {},
  redirect,
}) => {
  const videoId = typeof videoId_p === 'number' ? parseInt(videoId_p) || videoId_p : videoId_p;
  const [open, setOpen] = useState();
  const fadeOutTimer = useRef();
  const fadeInTimer = useRef();
  const { enableMyLists } = useContext(FeedsContext) || {};
  const ref = useRef();

  useClicksOutside(ref, handleClose, open);

  const handleOpen = (e) => {
    disablepreview();
    e.stopPropagation();
    clearTimeout(fadeOutTimer.current);
    if (!fadeInTimer.current) {
      fadeInTimer.current = setTimeout(() => {
        setOpen(true);
      }, 300);
    }
    return false;
  };

  function handleClose(e) {
    if (e) e.stopPropagation();
    clearTimeout(fadeInTimer.current);
    fadeInTimer.current = null;
    clearTimeout(fadeOutTimer.current);
    setOpen(false);
    return false;
  }

  // const toggle = (e) => {
  //   if (e) e.stopPropagation();
  //   clearTimeout(fadeOutTimer.current);
  //   clearTimeout(fadeInTimer.current);
  //   fadeInTimer.current = null;
  //   setOpen((c) => !c);
  // };

  const handleCloseDelayed = (e) => {
    e.stopPropagation();
    clearTimeout(fadeInTimer.current);
    fadeInTimer.current = null;
    clearTimeout(fadeOutTimer.current);
    fadeOutTimer.current = setTimeout(() => setOpen(false), 250);
    mouseLeaveEnablePreview();
    return false;
  };

  useEffect(() => {
    return () => {
      clearTimeout(fadeInTimer.current);
      clearTimeout(fadeOutTimer.current);
    };
  }, []);

  if (!enableMyLists) return null;

  return (
    <ButtonContainer
      className='listVideoButton'
      style={style}
      open={open}
      onMouseLeave={handleCloseDelayed}
      ref={ref}
    >
      <IconContainer
        onMouseOver={mouseOverDisablePreview}
        onClick={handleOpen}
        style={{ right: '0', position: 'absolute', margin: '5px' }}
        onMouseEnter={handleOpen}
        onMouseLeave={handleCloseDelayed}
      >
        {list ? <AddedItemBtn size={size} /> : <AddItemBtn size={size} />}
      </IconContainer>

      <CSSTransition in={open} timeout={250} classNames='fade' unmountOnExit>
        <AddToListModal handleOpen={handleOpen} videoId={videoId} redirect={redirect} />
      </CSSTransition>
    </ButtonContainer>
  );
};

export default AddToListButton;
