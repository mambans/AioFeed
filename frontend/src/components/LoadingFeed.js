import React from 'react';
import styled from 'styled-components';
import LoadingBoxes from '../pages/twitch/LoadingBoxes';
import { pulseAnimation } from '../pages/twitch/StyledComponents';
import { HeaderLines } from './../components/styledComponents';

const LoadingFeed = ({ title, order }) => {
  return (
    <Wrapper order={order}>
      <Header>
        <HeaderSection width={50} />
        <HeaderSection width={125} />
      </Header>
      <Line>
        <HeaderLines />
        {title}
        <HeaderLines />
      </Line>
      <VideosWrapper>
        <LoadingBoxes amount={4} type='big' />
      </VideosWrapper>
    </Wrapper>
  );
};
export default LoadingFeed;
const Wrapper = styled.div`
  order: ${({ order }) => order || 9999};
`;
const HeaderSection = styled.div`
  height: 50px;
  animation: ${pulseAnimation};
  position: relative;
  width: ${({ width }) => width || 200}px;
`;
const Header = styled.div`
  height: 50px;
  display: flex;
  justify-content: space-between;
`;
const VideosWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 0;
  /* min-height: ${({ collapsed }) => (collapsed ? 0 : 307)}px; */
  margin-bottom: 20px;
  width: 100%;
`;
const Line = styled.div`
  width: 100%;
  display: flex;
  -moz-box-pack: justify;
  justify-content: space-between;
  -moz-box-align: center;
  align-items: center;
  margin-top: -5px;
  min-height: 25px;

  h1 {
    margin: 0px 10px;
    font-size: 1.3rem;
  }
`;
