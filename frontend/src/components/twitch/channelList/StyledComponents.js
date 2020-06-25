import styled, { keyframes, css } from 'styled-components';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 5px 5px rgba(255, 0, 0, 0.25);;
  }

  60% {
    box-shadow: 0 0 5px 10px rgba(255, 0, 0, 0.5);
  }

  100% {
    box-shadow: 0 0 5px 5px rgba(255, 0, 0, 0.25);;
  }
`;

const pulseAnimation = () =>
  css`
    ${pulse} ${'2s'} infinite
  `;

export const ChannelListLi = styled.li`
  height: 50px;

  a {
    padding: 0;
    font-size: unset;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${({ selected }) => (selected ? '#ffffff' : 'inherit')};
    font-weight: ${({ selected }) => (selected ? 'bold' : 'unset')};
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 10px;

    img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      border-radius: 3px;
      animation: ${({ live }) => (live ? pulseAnimation : 'none')};
    }
  }

  .StreamFollowBtn {
    height: inherit;
  }

  div.ButtonContianer {
    display: flex;
    margin-right: 10px;
  }
`;
