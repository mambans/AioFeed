import React from 'react';
import { CSSTransition } from 'react-transition-group';

import { PlayerNavbar } from './../twitch/player/StyledComponents';

export default ({ visible }) => {
  return (
    <>
      <CSSTransition in={visible} timeout={300} classNames='fade-300ms' unmountOnExit>
        <PlayerNavbar></PlayerNavbar>
      </CSSTransition>
    </>
  );
};
