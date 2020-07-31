import React, { useRef } from 'react';

import { StyledLoadingListElement } from './styledComponents';

export default ({ amount, style = {} }) => {
  const array = useRef(
    Array.apply(null, Array(amount)).map(function (x, i) {
      return { id: i, width: `${Math.floor(Math.random() * 80)}%` };
    })
  );

  return array.current.map((item, index) => {
    return (
      <StyledLoadingListElement key={index} style={{ ...style }}>
        <div style={{ width: item.width }}></div>
      </StyledLoadingListElement>
    );
  });
};
