import React, { useContext, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { ButtonContainer } from '../StyledComponents';
import AddToListModal from './AddToListModal';
import MyListsContext from '../MyListsContext';
import { AddRemoveBtn } from './AddToListModal';
import useClicksOutside from '../../../hooks/useClicksOutside';

const AddToListButton = ({
  list,
  videoId_p,
  style = {},
  size,
  disablepreview = () => {},
  redirect,
}) => {
  const videoId = typeof videoId_p === 'number' ? parseInt(videoId_p) || videoId_p : videoId_p;
  const [open, setOpen] = useState();
  const fadeOutTimer = useRef();
  const { lists, setLists } = useContext(MyListsContext) || {};
  const ref = useRef();

  useClicksOutside(ref, handleClose, open);

  const openFunction = (e) => {
    e.stopPropagation();
    clearTimeout(fadeOutTimer.current);
    setTimeout(() => {
      setOpen(true);
      disablepreview();
    }, 500);
    return false;
  };

  function handleClose(e) {
    if (e) e.stopPropagation();
    clearTimeout(fadeOutTimer.current);
    setOpen(false);
    return false;
  }

  const toggle = (e) => {
    if (e) e.stopPropagation();
    clearTimeout(fadeOutTimer.current);
    setOpen((c) => !c);
  };

  const handleCloseDelayed = (e) => {
    e.stopPropagation();
    clearTimeout(fadeOutTimer.current);
    fadeOutTimer.current = setTimeout(() => setOpen(false), 250);

    return false;
  };

  return (
    <ButtonContainer
      className='listVideoButton'
      style={style}
      open={open}
      onMouseLeave={handleCloseDelayed}
      ref={ref}
    >
      <AddRemoveBtn
        list={list}
        videoId={videoId}
        // onMouseEnter={OpenFunction}
        style={{ right: '0', position: 'absolute', margin: '5px' }}
        size={size}
        lists={lists}
        setLists={setLists}
        onMouseEnter={openFunction}
        onMouseLeave={handleCloseDelayed}
        onClick={toggle}
      />
      <CSSTransition in={open} timeout={250} classNames='fade' unmountOnExit>
        <AddToListModal openFunction={openFunction} videoId={videoId} redirect={redirect} />
      </CSSTransition>
    </ButtonContainer>
  );
};

export default AddToListButton;
