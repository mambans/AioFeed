import React from 'react';
import styled from 'styled-components';
import { pulse } from '../twitch/StyledComponents';

export const Container = styled.div`
  /* width: ${({ width }) => width + 'px' || '15vw'}; */
  /* width: ${({ width }) => width}; */
  width: 14vw;
  height: ${({ footerVisibleInViewport }) =>
    footerVisibleInViewport ? `calc(92vh - ${footerVisibleInViewport}px)` : '92vh'};
  /* position: fixed;  */
  /* right: ${({ otherFeedsEnabled }) =>
    otherFeedsEnabled ? '25px' : 'calc(50% - (15vw / 2))'}; */
  /* top: 90px; */
  /* background: var(--twitterBackground); */
  background: var(--sidebarsBackgroundColor);
  border-radius: 10px 10px 2px 2px;
  transition: height 500ms;
  overflow: hidden;
  margin: 0 10px;

  @media screen and (max-width: 2560px) {
    width: 20vw;
    /* right: ${({ otherFeedsEnabled }) =>
      otherFeedsEnabled ? '25px' : 'calc(50% - (20vw / 2))'}; */
  }
`;

export const MainContainer = styled.div`
  width: max-content;
  transition: width 1000ms;
  position: fixed;
  top: 90px;
  height: ${({ footerVisibleInViewport }) =>
    footerVisibleInViewport ? `calc(92vh - ${footerVisibleInViewport}px)` : '92vh'};
  right: ${({ otherFeedsEnabled }) => (otherFeedsEnabled ? '10px' : '50%')};
  transform: ${({ otherFeedsEnabled }) => (otherFeedsEnabled ? 'unset' : 'translateX(50%)')};

  display: flex;
`;

export const NoListsAlertContainer = styled.div``;

export const LoadingTextBox = styled.div`
  width: 100%;
  height: 250px;
  display: grid;
  grid-template-rows: 20% auto;
`;

export const LoadingImageBox = styled.div`
  height: 450px;

  .img {
    height: calc(14vw / 1.777);
    border-radius: 20px;
    animation: ${pulse} 2s linear infinite;
    transform: translate3d(0, 0, 0);

    @media screen and (max-width: 2560px) {
      height: calc(20vw / 1.777);
    }
  }
`;

export const LoadingContainer = styled.div`
  padding: 20px;

  .username {
    height: 20px;
    border-radius: 10px;
    margin-bottom: 25px;
    width: 25%;
    animation: ${pulse} 2s linear infinite;
    transform: translate3d(0, 0, 0);
  }

  .text {
    div {
      height: 12px;
      border-radius: 6px;
      margin: 10px 0;
      animation: ${pulse} 2s linear infinite;
      transform: translate3d(0, 0, 0);

      :last-of-type {
        width: 45%;
      }
    }
  }
`;

export const LoadingPlaceholder = () => {
  return (
    <LoadingContainer>
      <LoadingTextBox>
        <div className='username'></div>
        <div className='text'>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </LoadingTextBox>
      <LoadingImageBox>
        <div className='username'></div>
        <div className='text'>
          <div></div>
          <div></div>
        </div>
        <div className='img'></div>
      </LoadingImageBox>
      <LoadingTextBox>
        <div className='username'></div>
        <div className='text'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </LoadingTextBox>
      <LoadingTextBox>
        <div className='username'></div>
        <div className='text'>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </LoadingTextBox>
    </LoadingContainer>
  );
};
