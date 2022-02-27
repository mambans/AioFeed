import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

export const VodLiveIndicator = styled(Link)`
  &&& {
    display: flex;
  }
  width: 48px;
  height: 24px;
  transform: scale(1);
  padding: 5px;
  font-size: 0.85rem;
  position: absolute;
  background: #d10303;
  color: white;
  border-radius: 10px;
  font-weight: bold;
  align-items: center;
  border: 1px solid #f00;
  justify-content: center;
  margin: 3px;
  opacity: 0.8;
  transition: opacity 150ms, color 150ms;
  right: 0;

  &:hover {
    opacity: 1;
    color: white;
  }
`;

export const VodType = styled.div`
  display: flex;
  justify-content: right;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.5;
  transition: opacity 250ms, background 250ms;
  border-radius: 10px 0px 10px 0px;
  background: rgba(10, 10, 10, 0.3);
  padding: 4px;
  font-size: 0.9rem;
  color: #dcdcdc;

  &:hover {
    opacity: 1;
    background: rgba(10, 10, 10, 0.7);
  }
`;

export const VodChannelListLi = styled.li`
  min-height: 43px;
  border-bottom: thin solid #1e1616;
  list-style: none;

  a {
    color: var(--textColor1);
    &:hover {
      color: var(--textColor1Hover);
    }
  }

  button {
    opacity: 1;
  }
`;

const AnimateVodPreview = (height) => keyframes`
  from {
    background-position-y: ${height * 10}px;
  }
  to {
    background-position-y: ${height}px;
  }
`;

export const VodPreview = styled.div`
  position: absolute;
  animation: ${({ feedVideoSizeProps }) => AnimateVodPreview((feedVideoSizeProps.width / 16) * 9)}
    5s steps(9);
  animation-fill-mode: forwards;
  object-fit: cover;
  background-size: cover;
  width: 100%;
  height: 100%;
  background-image: ${({ previewAvailable }) => `url(${previewAvailable})`};
  border-radius: 10px;
`;

export const VodDates = styled.div`
  color: var(--textColor2);
  font-size: 0.95em;
  grid-column: 3;
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: right;
  justify-self: right;
  white-space: nowrap;
  overflow: hidden;

  p {
    margin: 0;
  }

  .date {
    position: relative;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0;
    align-items: center;

    &::after {
      content: 'ago';
      padding-left: 5px;
    }
  }

  & > div:hover {
    #timeago {
      display: none;
    }

    #time {
      display: flex;
    }
  }

  #time {
    display: none;
  }
`;

export const VodChannelListPopupTrigger = styled.div`
  width: 50px;
  min-width: 50px;
  margin-left: 250px;
  justify-content: right;
  display: flex;
`;

export const VodChannelListPopup = styled.div`
  max-height: 600px;
  position: absolute;
  top: 0;
  background: var(--popupListsBackground);
  overflow: auto;
  z-index: 2;

  form {
    padding: 5px;
  }

  input[type='text'] {
    color: white;
    border: none;
    border-bottom: 1px solid white;
    background-color: transparent;
  }

  input[type='submit'] {
    border-radius: 5px;
    border: thin solid #484848;
    background-color: #035879;
    color: rgb(224, 224, 224);
    width: 100%;
    margin-top: 5px;

    &:hover {
      color: white;
      background-color: #097099;
    }
  }
  ul li {
    button {
      &&& {
        background-color: none;
        background: none;
        border: none;
      }

      i {
        color: rgb(172, 34, 47);
      }

      &:hover i {
        color: red;
      }
    }
  }
`;
