import React from "react";

import { StyledLoadingList } from "./styledComponents";

export default props => {
  const array = Array.apply(null, Array(props.amount)).map(function(x, i) {
    return i;
  });

  return (
    <StyledLoadingList>
      {array.map((item, index) => {
        return (
          <li key={index}>
            <div style={{ width: `${Math.floor(Math.random() * 80)}%` }}></div>
          </li>
        );
      })}
    </StyledLoadingList>
  );
};
