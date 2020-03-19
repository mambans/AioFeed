import React from "react";

import { StyledLoadingBox } from "./StyledComponents";

export default ({ amount, type }) => {
  const array = Array.apply(null, Array(amount)).map(function(x, i) {
    return i;
  });

  return array.map(index => {
    return (
      <StyledLoadingBox key={index} type={type}>
        <div id='video'></div>
        <div id='title'>
          <div></div>
        </div>
        <div id='details'>
          <div id='channel'></div>
          <div id='game'></div>
        </div>
      </StyledLoadingBox>
    );
  });
};
