import React from 'react';

import { LoadingVideoElement } from './StyledComponents';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const LoadingBoxes = ({ amount = 3, type, load = true }) => {
  const array = Array.apply(null, Array(Math.floor(Math.max(amount, 1)))).map((x, i) => i);

  if (load) {
    return (
      <TransitionGroup component={null}>
        {array.map((v) => (
          <CSSTransition key={v} timeout={250} classNames='fade-250ms' unmountOnExit>
            <LoadingVideoElement type={type} />
          </CSSTransition>
        ))}
      </TransitionGroup>
    );
  }
  return null;
};
export default LoadingBoxes;
