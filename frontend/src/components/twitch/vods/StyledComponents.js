import styled from "styled-components";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const VodLiveIndicator = styled(Nav.Link).attrs({ as: NavLink })`
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

export { VodLiveIndicator };
