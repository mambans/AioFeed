import React from "react";

import { StyledLoadingBox } from "./StyledComponents";
import { TransitionGroup, CSSTransition } from "react-transition-group";

export default ({ amount, type, load = true }) => {
  const array = Array.apply(null, Array(amount)).map(function (x, i) {
    return i;
  });

  if (load) {
    return (
      <TransitionGroup component={null}>
        {array.map((index) => {
          return (
            <CSSTransition key={index} timeout={250} classNames='fade-250ms' unmountOnExit>
              <StyledLoadingBox type={type}>
                <div id='video'></div>
                <div id='title'>
                  <div></div>
                </div>
                <div id='details'>
                  <div id='channel'></div>
                  <div id='game'></div>
                </div>
              </StyledLoadingBox>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  } else {
    return null;
  }
};
