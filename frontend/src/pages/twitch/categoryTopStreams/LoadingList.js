import React, { useRef } from 'react';

import { StyledLoadingListElement } from './styledComponents';

const LoadingList = ({ amount, style = {} }) => {
  const array = useRef(
    Array.apply(null, Array(amount)).map((x, i) => ({
      id: i,
      width: `${Math.floor(Math.random() * 80)}%`,
    }))
  );

  return array.current.map((item, index) => (
    <StyledLoadingListElement key={index} style={{ ...style }}>
      <div style={{ width: item.width }}></div>
    </StyledLoadingListElement>
  ));
};
export default LoadingList;
