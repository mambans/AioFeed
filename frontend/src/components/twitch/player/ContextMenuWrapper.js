import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

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
  padding: 0px 10px;
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

const ContextMenuWrapper = ({
  outerContainer = window,
  showAndResetTimer = () => {},
  children,
}) => {
  const [show, setShow] = useState(false);
  const menuRef = useRef();
  const toggleShowHide = useCallback(
    (e) => {
      console.log('toggleShowHide:');
      if (show) return true;
      e.preventDefault();
      showAndResetTimer();
      const boundary = outerContainer.getBoundingClientRect();
      const mouseX = e.clientX - boundary.left;
      const mouseY = e.clientY;

      setShow({
        show: true,
        x: mouseX + WIDTH > boundary.width ? mouseX - (mouseX + WIDTH - boundary.width) : mouseX,
        y:
          mouseY + HEIGHT > boundary.bottom ? mouseY - (mouseY + HEIGHT - boundary.bottom) : mouseY,
      });
      return false;
    },
    [outerContainer, showAndResetTimer, show]
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
