import React, { useContext, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { ButtonContainer } from './../StyledComponents';
import AddToListModal from './AddToListModal';
import FavoritesContext, { FavoritesProvider } from './../FavoritesContext';
import { AddRemoveBtn } from './AddToListModal';

const FavoriteButton = ({ list, videoId_p, style = {}, size, disablepreview = () => {} }) => {
  const videoId = typeof videoId_p === 'number' ? parseInt(videoId_p) || videoId_p : videoId_p;
  const [open, setOpen] = useState();
  const fadeOutTimer = useRef();
  const { lists, setLists } = useContext(FavoritesContext) || {};

  const OpenFunction = (e) => {
    e.stopPropagation();
    clearTimeout(fadeOutTimer.current);
    setTimeout(() => {
      setOpen(true);
      disablepreview();
    }, 100);
    return false;
  };

  const CloseFunction = (e) => {
    if (e) e.stopPropagation();
    clearTimeout(fadeOutTimer.current);
    setOpen(false);
    return false;
  };

  const CloseFunctionDelay = (e) => {
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
      onMouseLeave={CloseFunctionDelay}
    >
      <AddRemoveBtn
        list={list}
        videoId={videoId}
        // onMouseEnter={OpenFunction}
        style={{ right: '0', position: 'absolute', margin: '5px' }}
        size={size}
        lists={lists}
        setLists={setLists}
        onMouseEnter={OpenFunction}
        onMouseLeave={CloseFunctionDelay}
      />

      <CSSTransition in={open} timeout={250} classNames='fade' unmountOnExit>
        {setLists ? (
          <AddToListModal
            OpenFunction={OpenFunction}
            CloseFunctionDelay={CloseFunctionDelay}
            CloseFunction={CloseFunction}
            videoId={videoId}
          />
        ) : (
          <FavoritesProvider>
            <AddToListModal
              OpenFunction={OpenFunction}
              CloseFunctionDelay={CloseFunctionDelay}
              CloseFunction={CloseFunction}
              videoId={videoId}
            />
          </FavoritesProvider>
        )}
      </CSSTransition>
    </ButtonContainer>
  );
};

export default FavoriteButton;
