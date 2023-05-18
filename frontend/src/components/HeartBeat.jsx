import React from 'react';
import styled, { keyframes } from 'styled-components';
import Colors from './themes/Colors';

export const heartBeatAnimation = keyframes`
  0% {
    transform: scale(0);
    -moz-transform: scale(0);
    -webkit-transform: scale(0);
    opacity: 0;
  }
  35% {
    transform: scale(0.1);
    -moz-transform: scale(0.1);
    -webkit-transform: scale(0.1);
    opacity: 0.1;
  }
  50% {
    transform: scale(0.5);
    -moz-transform: scale(0.5);
    -webkit-transform: scale(0.5);
    opacity: 0.3;
  }
  75% {
    transform: scale(0.8);
    -moz-transform: scale(0.8);
    -webkit-transform: scale(0.8);
    opacity: 0.5;
  }
  to {
    transform: scale(1);
    -moz-transform: scale(1);
    -webkit-transform: scale(1);
    opacity: 0;
  }
`;

const StyledHeartBeatWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  top: 0;
  transform: translate(50%, -50%);
`;

const StyledHeartBeatPulseRings = styled.div`
  animation: ${heartBeatAnimation} 1.25s ease-out;
  -webkit-animation: ${heartBeatAnimation} 1.25s ease-out;
  -moz-animation: ${heartBeatAnimation} 1.25s ease-out;
  animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  z-index: 10;
  /* border: 5px solid ${Colors.red}; */
  border: ${({ scale, scaleRings }) => `${5 * (scaleRings ? scale : 1)}px solid ${Colors.red}`};
  border-radius: 50%;
  height: ${({ scale, scaleRings }) => (scaleRings ? 26 * scale : 6 * scale + 20)}px;
  width: ${({ scale, scaleRings }) => (scaleRings ? 26 * scale : 6 * scale + 20)}px;
  position: absolute;
`;
const StyledHeartBeatDot = styled.div`
  border-radius: 50%;
  height: ${({ scale }) => 6 * scale}px;
  width: ${({ scale }) => 6 * scale}px;
  background: ${Colors.red};
`;

const RelativeContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const HeartBeat = ({ scale = 1, scaleRings = true, style }) => {
  return (
    <StyledHeartBeatWrapper style={style}>
      <RelativeContainer>
        <StyledHeartBeatPulseRings scale={scale} scaleRings={scaleRings} />
        <StyledHeartBeatDot scale={scale} />
      </RelativeContainer>
    </StyledHeartBeatWrapper>
  );
};
