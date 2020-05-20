import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import Moment from "react-moment";

export const VodLiveIndicator = styled(Link)`
  padding: 5px;
  font-size: 0.8rem;
  position: absolute;
  background: #d10303;
  color: white;
  border-radius: 12px;
  font-weight: bold;
  width: 48px !important;
  height: 24px !important;
  display: flex !important;
  align-items: center;
  border: 1px solid #f00;
  justify-content: center;
  margin: 3px;
  opacity: 0.8;
  transition: opacity 150ms, color 150ms;
  transform: scale(1) !important;

  &:hover {
    opacity: 1;
    color: white;
  }
`;

export const VodType = styled.div`
  position: relative;
  bottom: 219px;
  display: flex;
  justify-content: right;

  span {
    border-radius: 0px 10px 0px 10px;
    background: rgba(10, 10, 10, 0.8) none repeat scroll 0% 0%;
    padding: 3px;
    font-size: 0.95rem;
    color: #dcdcdc;
  }
`;

export const VodChannelListLi = styled.li`
  min-height: 43px;
  border-bottom: thin solid #1e1616;

  button {
    opacity: 1;
  }
`;

export const LastRefreshText = styled(Moment).attrs({ fromNow: true, interval: 60000 })`
  position: relative;
  left: 10%;
  color: var(--textColor2);
`;

const AnimateVodPreview = keyframes`
  from {
    background-position-y: 1890px;
  }
  to {
    background-position-y: 189px;
  }
`;

export const VodPreview = styled.div`
  position: absolute;
  animation: ${AnimateVodPreview} 5s steps(9);
  animation-fill-mode: forwards;
  object-fit: cover;
  background-size: cover;
  /* opacity: 0; */

  width: 336px;
  height: 189px;
  background-image: ${({ previewAvailable }) => `url(${previewAvailable})`};
  border-radius: 10px;

  /* display: none; */
  /* opacity: 0; */

  /* animation: AnimateVodPreview 5s; */
  /* animation-delay: 0.5s; */
  /* image-rendering: optimizequality; */
  /* image-rendering: crisp-edges; */
  /* image-rendering: optimizespeed; */
`;

export const VodDates = styled.div`
  /* grid-area: info; */
  color: var(--textColor2);
  font-size: 0.95rem;
  grid-column: 3;
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: right;
  justify-self: right;
  /* mix-blend-mode: screen; */

  p {
    margin: 0;
  }

  .date {
    position: relative;
    display: flex;
    justify-content: flex-end;
    grid-column: 3;
    padding-right: 10px;
    margin-bottom: 0;
    align-items: center;

    &::after {
      content: "ago";
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
