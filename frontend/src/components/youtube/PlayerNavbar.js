import React from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { CSSTransition } from "react-transition-group";

import { PlayerNavbar, NavigateBack } from "./../twitch/player/StyledComponents";

export default ({ visible }) => {
  const navigate = useNavigate();

  return (
    <>
      <CSSTransition in={visible} timeout={300} classNames='fade-300ms' unmountOnExit>
        <PlayerNavbar>
          <NavigateBack onClick={() => navigate(-1)} variant='dark' title='Go back'>
            <MdArrowBack size={25} />
            Go back
          </NavigateBack>
        </PlayerNavbar>
      </CSSTransition>
    </>
  );
};
