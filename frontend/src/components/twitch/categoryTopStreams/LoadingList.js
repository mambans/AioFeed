import React from 'react';

import { StyledLoadingListElement } from './styledComponents';

export default ({ amount, style = {} }) => {
  const array = Array.apply(null, Array(amount)).map(function (x, i) {
    return i;
  });

  return array.map((item, index) => {
    return (
      <StyledLoadingListElement key={index} style={{ ...style }}>
        <div style={{ width: `${Math.floor(Math.random() * 80)}%` }}></div>
      </StyledLoadingListElement>
    );
  });
};
