import React from "react";
import { StyledLoadingBox } from "./styledComponents";

export default props => {
  const array = Array.apply(null, Array(props.amount)).map(function(x, i) {
    return i;
  });

  return array.map(index => {
    return (
      <StyledLoadingBox key={index}>
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
