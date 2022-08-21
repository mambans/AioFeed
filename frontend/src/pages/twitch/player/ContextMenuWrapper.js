import React, { useCallback, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { MdKeyboardArrowRight } from 'react-icons/md';

import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import useClicksOutside from '../../../hooks/useClicksOutside';

const MIN_HEIGHT = 275;
const WIDTH = 275;

const styles = css`
  background-color: rgba(23, 23, 25, 0.94);
  border-radius: 3px;
  & > * {
    cursor: pointer;
    transition: color 250ms;
    font-size: 0.9em;
    padding: 8px;
    color: rgb(200, 200, 200);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

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
      background-color: rgba(51, 51, 61, 0.94);
      overflow: visible;
    }
  }
`;

const Container = styled.div`
  position: absolute;
  width: ${WIDTH}px;
  min-height: ${MIN_HEIGHT}px;
  max-height: ${({ maxHeight }) => maxHeight + 'px'};

  left: ${({ left }) => left + 'px'};
  top: ${({ top }) => top + 'px'};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  pointer-events: ${({ show }) => (show ? 'all' : 'none')};
  /* padding: 0px 10px; */
  font-weight: bold;
  color: rgb(225, 225, 225);

  ${styles}
`;
const StyledArrow = styled(MdKeyboardArrowRight)`
  &&& {
    position: absolute;
    right: 0;
    transform: rotate(0deg);
    transition: transform 250ms, fill 250ms;
    fill: rgb(200, 200, 200);
    top: 0;
    height: 100%;
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
  z-index: 1;

  ${styles}

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

const StyledDropDownTrigger = styled.div`
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
      {trigger || null}
      <StyledArrow size={24} />
      <ContextMenuDropDownList>{children || null}</ContextMenuDropDownList>
    </StyledDropDownTrigger>
  );
};

const ContextMenuWrapper = ({
  outerContainer,
  showAndResetTimer = () => {},
  includeMarginTop,
  children,
}) => {
  const [show, setShow] = useState({});
  const menuRef = useRef();
  const toggleShowHide = useCallback(
    (e) => {
      if (show) return true;
      e.preventDefault();
      showAndResetTimer();
      const boundary = outerContainer?.getBoundingClientRect() || {
        width: window.innerWidth,
        height: window.innerHeight,
        bottom: 0,
        left: 0,
        top: 0,
      };
      const mouseX = e.clientX - boundary.left;
      const mouseY = e.clientY - (includeMarginTop ? boundary.top : 0);

      const menu = menuRef?.current?.getBoundingClientRect?.();
      const menuHeight = menu.height;
      const menuWidth = menu.width;

      setShow({
        show: true,
        x: Math.max(0, Math.min(mouseX, boundary.width - menuWidth)),
        y: Math.max(0, Math.min(mouseY, boundary.height - menuHeight)),
        maxHeight: boundary.height,
      });
      return false;
    },
    [outerContainer, showAndResetTimer, show, includeMarginTop]
  );
  useEventListenerMemo('contextmenu', toggleShowHide, outerContainer);
  useClicksOutside(menuRef, () => setShow(false), show);

  // if (show?.show) {
  return (
    <Container
      left={show?.x}
      top={show?.y}
      ref={menuRef}
      maxHeight={show?.maxHeight}
      show={show?.show}
      onClick={() => setShow({})}
    >
      {children || null}
    </Container>
  );
  // }
  // return null;
};
export default ContextMenuWrapper;
