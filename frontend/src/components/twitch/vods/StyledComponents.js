import styled from "styled-components";
import { Link } from "react-router-dom";

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
  button {
    opacity: 1;
  }
`;
