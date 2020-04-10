import React from "react";

import { StyledLoadingListElement } from "./styledComponents";

export default (props) => {
  const array = Array.apply(null, Array(props.amount)).map(function (x, i) {
    return i;
  });

  return array.map((item, index) => {
    return (
      <StyledLoadingListElement key={index}>
        <div style={{ width: `${Math.floor(Math.random() * 80)}%` }}></div>
      </StyledLoadingListElement>
    );
  });
};
