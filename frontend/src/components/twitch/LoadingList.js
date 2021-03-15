import React from 'react';

import { StyledLoadingList } from './StyledComponents';

export default (props) => {
  const array = Array.apply(null, Array(props.amount)).map((x, i) => i);

  return (
    <StyledLoadingList>
      {array.map((item, index) => (
        <li key={index}>
          <div style={{ width: `${Math.floor(Math.random() * 80)}%` }}></div>
        </li>
      ))}
    </StyledLoadingList>
  );
};
