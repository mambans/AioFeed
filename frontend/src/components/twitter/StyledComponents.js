import React from "react";
import styled from "styled-components";
import { pulse } from "../twitch/StyledComponents";

export const Container = styled.div`
  /* width: ${({ width }) => width + "px" || "15vw"}; */
  /* width: ${({ width }) => width}; */
  width: 15vw;
  height: 92vh;
  position: fixed;
  right: 25px;
  top: 90px;
  background: #1010108c;
  border-radius: 20px;

  @media screen and (max-width: 2560px) {
    width: 20vw;
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
    height: calc(15vw / 1.777);
    border-radius: 20px;
    animation: ${pulse} 2s linear infinite;

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
