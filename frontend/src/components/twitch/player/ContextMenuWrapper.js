import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowRight } from 'react-icons/md';

import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import useClicksOutside from '../../../hooks/useClicksOutside';

const HEIGHT = 275;
const WIDTH = 250;

const Container = styled.div`
  position: absolute;
  width: ${WIDTH}px;
  min-height: ${HEIGHT}px;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 3px;
  left: ${({ left }) => left + 'px'};
  top: ${({ top }) => top + 'px'};
  /* padding: 0px 10px; */
  font-weight: bold;
  color: rgb(225, 225, 225);

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      cursor: pointer;
      margin: 10px 0;
      transition: color 250ms;
      font-size: 1rem;
      padding: 0 10px;
      color: rgb(200, 200, 200);

      svg {
        margin-right: 5px;
        color: inherit;
        stroke: rgb(225, 225, 225);

        path {
          stroke: rgb(225, 225, 225);
        }
      }

      &:hover,
      &:hover svg {
        color: #ffffff;
        opacity: 1;
      }
    }
  }
`;
const StyledArrow = styled(MdKeyboardArrowRight)`
  &&& {
    position: absolute;
    right: 0;
    transform: rotate(0deg);
    transition: transform 250ms, fill 250ms;
    fill: rgb(200, 200, 200);
  }
`;

export const ContextMenuDropDownList = styled.div`
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  transform: translateX(85%);
  top: -10px;
  transition: opacity 250ms, transform 250ms;

  & > div {
    padding: 1px 7px;
    background: rgba(0, 0, 0, 0.75);
    border-radius: 3px;
    margin-left: 5px;
  }

  &:hover {
    opacity: 1;
    pointer-events: all;
    transform: translateX(100%);

    ${StyledArrow} {
      transform: rotate(45deg);
      fill: rgb(255, 255, 255);
    }
  }
`;

const StyledDropDownTrigger = styled.li`
  position: relative;
  &:hover {
    ${ContextMenuDropDownList} {
      opacity: 1;
      pointer-events: all;
      transform: translateX(100%);
    }
    ${StyledArrow} {
      transform: rotate(45deg);
      fill: rgb(255, 255, 255);
    }
  }
`;

export const ContextMenuDropDown = ({ trigger, children }) => {
  return (
    <StyledDropDownTrigger>
      {trigger}
      <StyledArrow size={24} />
      <ContextMenuDropDownList>
        <div>{children}</div>
      </ContextMenuDropDownList>
    </StyledDropDownTrigger>
  );
};

const ContextMenuWrapper = ({
  outerContainer,
  showAndResetTimer = () => {},
  includeMarginTop,
  children,
}) => {
  const [show, setShow] = useState(false);
  const menuRef = useRef();
  const toggleShowHide = useCallback(
    (e) => {
      if (show) return true;
      e.preventDefault();
      showAndResetTimer();
      const boundary = outerContainer
        ? outerContainer.getBoundingClientRect()
        : {
            width: window.innerWidth,
            bottom: 0,
            left: 0,
            top: 0,
          };
      const mouseX = e.clientX - boundary.left;
      const mouseY = e.clientY - (includeMarginTop ? boundary.top : 0);

      setShow({
        show: true,
        x: mouseX + WIDTH > boundary.width ? mouseX - (mouseX + WIDTH - boundary.width) : mouseX,
        y:
          mouseY + HEIGHT > boundary.bottom ? mouseY - (mouseY + HEIGHT - boundary.bottom) : mouseY,
      });
      return false;
    },
    [outerContainer, showAndResetTimer, show, includeMarginTop]
  );
  useEventListenerMemo('contextmenu', toggleShowHide, outerContainer);
  useClicksOutside(menuRef, () => setShow(false), show);

  if (show?.show) {
    return (
      <Container left={show.x} top={show.y} ref={menuRef}>
        <ul onClick={() => setShow(false)}>{children}</ul>
      </Container>
    );
  }
  return null;
};
export default ContextMenuWrapper;
