import React from "react";
import ReactLoading from "react-loading";
import { StyledLoadingContainer } from "./sharedStyledComponents";

export default ({ text, height, width, type, style }) => {
  return (
    <StyledLoadingContainer style={style || null}>
      <ReactLoading
        type={type || "bars"}
        color={"#ffffff"}
        height={height || 150}
        width={width || 150}
      />
      {text && <h1>{text}</h1>}
    </StyledLoadingContainer>
  );
};
