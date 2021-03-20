import React, { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { Open, ButtonContainer } from './../StyledComponents';
import ButtonLists from './ButtonLists';
import './../FavoritesTransitions.scss';
import { FavoritesProvider } from './../FavoritesContext';
import { AddRemoveBtn } from './ButtonLists';

export default ({
  list,
  videoId_p,
  style = {},
  size,
  disablepreview = () => {},
  disableContextProvider = false,
}) => {
  const videoId = typeof videoId_p === 'number' ? parseInt(videoId_p) || videoId_p : videoId_p;
  const [open, setOpen] = useState();
  const fadeOutTimer = useRef();

  const OpenFunction = (e) => {
    e.stopPropagation();
    clearTimeout(fadeOutTimer.current);
    setOpen(true);
    setTimeout(() => disablepreview(), 0);
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
      {!open ? (
        <Open
          onClick={OpenFunction}
          onMouseEnter={OpenFunction}
          onMouseLeave={CloseFunctionDelay}
          open={open}
          size={size || 18}
        />
      ) : (
        <AddRemoveBtn
          list={list}
          videoId={videoId}
          // onMouseEnter={OpenFunction}
          style={{ right: '0', position: 'absolute', margin: '5px' }}
        />
        // <Close
        //   onClick={CloseFunction}
        //   onMouseEnter={OpenFunction}
        //   onMouseLeave={CloseFunctionDelay}
        //   open={open}
        //   size={size * 0.8 || 18}
        // />
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
