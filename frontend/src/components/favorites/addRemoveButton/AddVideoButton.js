import React, { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { Open, Close, ButtonContainer } from './../StyledComponents';
import ButtonLists from './ButtonLists';
import './../FavoritesTransitions.scss';
import { FavoritesProvider } from './../FavoritesContext';

export default ({
  videoId_p,
  style = {},
  size,
  disablepreview = () => {},
  disableContextProvider = false,
}) => {
  const videoId = typeof videoId_p === 'number' ? parseInt(videoId_p) || videoId_p : videoId_p;
  const [open, setOpen] = useState();
  const fadeOutTimer = useRef();
  const openTimer = useRef();

  const OpenFunction = (e) => {
    e.stopPropagation();
    clearTimeout(fadeOutTimer.current);
    clearTimeout(openTimer.current);
    setOpen(true);
    setTimeout(() => disablepreview(), 0);
  };

  const OpenFunctionDelay = (e) => {
    e.stopPropagation();
    clearTimeout(fadeOutTimer.current);
    clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => setOpen(true), 250);
    setTimeout(() => disablepreview(), 0);
  };

  const CloseFunction = (e) => {
    if (e) e.stopPropagation();
    clearTimeout(fadeOutTimer.current);
    clearTimeout(openTimer.current);
    setOpen(false);
  };

  const CloseFunctionDelay = (e) => {
    e.stopPropagation();
    clearTimeout(fadeOutTimer.current);
    clearTimeout(openTimer.current);
    fadeOutTimer.current = setTimeout(() => setOpen(false), 250);
  };

  return (
    <ButtonContainer className='listVideoButton' style={style} open={open}>
      {!open ? (
        <Open
          onClick={OpenFunction}
          onMouseEnter={OpenFunctionDelay}
          onMouseLeave={CloseFunctionDelay}
          open={open}
          size={size || 18}
        />
      ) : (
        <Close
          onClick={CloseFunction}
          onMouseEnter={OpenFunctionDelay}
          onMouseLeave={CloseFunctionDelay}
          open={open}
          size={size || 18}
        />
      )}

      <CSSTransition in={open} timeout={250} classNames='fade' unmountOnExit>
        {disableContextProvider ? (
          <ButtonLists
            OpenFunction={OpenFunction}
            CloseFunctionDelay={CloseFunctionDelay}
            CloseFunction={CloseFunction}
            videoId={videoId}
          />
        ) : (
          <FavoritesProvider>
            <ButtonLists
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
