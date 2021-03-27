import React from 'react';
import styled from 'styled-components';
import { pulse } from '../twitch/StyledComponents';

export const Container = styled.div`
  width: 14vw;
  height: 92vh;
  background: var(--twitterBackground);
  border-radius: 10px 10px 2px 2px;
  transition: height 500ms;
  overflow: hidden;

  @media screen and (max-width: 2560px) {
    width: 19vw;
  }

  &.twitterList-enter {
    opacity: 0;
    width: 0 !important;
    margin: 0 !important;
    transition: opacity 500ms, width 750ms, margin-left 750ms, margin-right 750ms !important;
  }

  &.twitterList-enter-done {
    opacity: 1;
    width: 14vw !important;
    margin: 0 10px !important;
    transition: opacity 500ms, width 750ms, margin-left 750ms, margin-right 750ms !important;
  }

  &.twitterList-enter-active {
    opacity: 1;
    width: 14vw !important;
    margin: 0 10px !important;
    transition: opacity 500ms, width 750ms, margin-left 750ms, margin-right 750ms !important;
  }

  &.twitterList-exit {
    opacity: 1;
    width: 14vw !important;
    margin: 0 10px !important;
    transition: opacity 500ms, width 750ms, margin-left 750ms, margin-right 750ms !important;
  }

  &.twitterList-exit-active {
    opacity: 0;
    width: 0 !important;
    margin: 0 !important;
    transition: opacity 500ms, width 750ms, margin-left 750ms, margin-right 750ms !important;
  }

  &.twitterList-exit-done {
    opacity: 0;
    width: 0 !important;
    margin: 0 !important;
    transition: opacity 500ms, width 750ms, margin-left 750ms, margin-right 750ms !important;
  }
`;

export const MainContainer = styled.div`
  width: max-content;
  transition: width 1000ms, margin-right 100ms, right 100ms;
  position: fixed;
  top: 90px;
  height: 92vh;
  left: ${({ center }) => (center ? '50%' : 'calc(86vw - 28px)')};
  transform: ${({ center }) => (center ? 'translateX(-50%)' : 'unset')};

  display: flex;

  @media screen and (max-width: 2560px) {
    left: ${({ center }) => (center ? '50%' : 'calc(81vw - 28px)')};
  }

  &.twitter-slide-enter {
    opacity: 0;
    transform: translate3d(15vw, 0, 0);
    transition: opacity 375ms, transform 750ms;

    @media screen and (max-width: 3420px) {
      transform: translate3d(19vw, 0, 0);
    }
  }

  &.twitter-slide-enter-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition: opacity 375ms, transform 750ms;
  }

  &.twitter-slide-exit {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition: opacity 375ms, transform 750ms;
  }

  &.twitter-slide-exit-active {
    opacity: 0;
    transform: translate3d(15vw, 0, 0);
    transition: opacity 375ms, transform 750ms;

    @media screen and (max-width: 3420px) {
      right: -19vw;
    }
  }

  &.twitter-slide-enter-done {
    transform: translate3d(0, 0, 0);
    transition: opacity 375ms, transform 750ms;
  }

  &.twitter-slide-appear-active {
    transform: translate3d(0, 0, 0);
    transition: opacity 375ms, transform 750ms;
  }
`;

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

    @media screen and (max-width: 2560px) {
      height: calc(19vw / 1.777);
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
  }

  .text {
    div {
      height: 12px;
      border-radius: 6px;
      margin: 10px 0;
      animation: ${pulse} 2s linear infinite;

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
