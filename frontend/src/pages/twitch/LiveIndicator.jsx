import React from 'react';
import styled from 'styled-components';
import { heartBeatAnimation } from '../../components/HeartBeat';
import Colors from '../../components/themes/Colors';

const LiveIndicator = ({ text = 'Live', children }) => {
  return (
    <Wrapper>
      <InnerWrapper>
        <Rings />
        {text}
        {children}
      </InnerWrapper>
    </Wrapper>
  );
};
export default LiveIndicator;

const Wrapper = styled.div`
  position: relative;
  isolation: isolate;

  display: inline;
`;
const InnerWrapper = styled.div`
  padding: 2px 7px;
  background: ${Colors.red};
  border-radius: 4px;
  color: #ffffff;

  display: inline;
  /* box-shadow: 0px 0px 10px 5px red; */

  /* &::after {
    content: '';
    position: absolute;
    inset: -3px;
    background: ${Colors.red};
    z-index: -1;
    border-radius: inherit;
  } */
`;

const Rings = styled.div`
  animation: ${heartBeatAnimation} 1.25s ease-out;
  -webkit-animation: ${heartBeatAnimation} 1.25s ease-out;
  -moz-animation: ${heartBeatAnimation} 1.25s ease-out;
  animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  z-index: -1;
  /* border: 5px solid ${Colors.red}; */
  border: ${`6px solid ${Colors.red}`};
  border-radius: 5px;
  inset: -12px;
  position: absolute;
`;
