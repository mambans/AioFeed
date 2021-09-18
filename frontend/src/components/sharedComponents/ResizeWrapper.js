import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getLocalstorage } from '../../util';
import BackDrop from '../sharedComponents/BackDrop';

export const ResizeDevider = styled.div`
  height: 100%;
  cursor: w-resize;
  grid-area: devider;
  transition: background 500ms;
  background: ${({ resizeActive }) => (resizeActive ? 'rgb(40,40,40)' : '#121314')};
  display: flex;
  transform: translate3d(0, 0, 0);
  position: absolute;
  width: ${({ width }) => width || 3}px;

  > div {
    transition: opacity 500ms, height 250ms;
    opacity: ${({ resizeActive, dimmer }) => (resizeActive ? 1 : dimmer ? 0.05 : 0.4)};
    background: #ffffff;
    width: 33%;
    margin: auto;
    height: ${({ resizeActive }) => (resizeActive ? '40%' : '10%')};
  }

  &:hover > div {
    transition: opacity 250ms, height 500ms;
    opacity: 1;
    height: 40%;
  }
`;

const MIN_WIDTH = 50;

const ResizeWrapper = ({ children, parentCallbackWidth = () => {} }) => {
  const [resize, setResize] = useState({
    active: false,
    width: getLocalstorage('resize-widths')?.[children.props.id] || 500,
  });
  const rightSideRef = useRef();
  const ResizeDeviderRef = useRef();
  const timer = useRef();

  const handleMouseDown = () => {
    setResize((c) => ({ ...c, active: true }));
  };

  const handleMouseUp = () => {
    setResize((c) => ({ ...c, active: false }));

    const savedWidths = getLocalstorage('resize-widths');

    localStorage.setItem(
      'resize-widths',
      JSON.stringify({ ...savedWidths, [children.props.id]: resize.width })
    );
  };

  const parentCallbackWidthDebounce = useCallback(
    (id, width) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        parentCallbackWidth(id, width);
      }, 25);
    },
    [parentCallbackWidth]
  );

  const handleResize = useCallback(
    (e) => {
      e.preventDefault();
      if (resize.active) {
        const mouseX = e.clientX;
        const rightSideRefPosition = rightSideRef.current.getBoundingClientRect();

        const newWidth = Math.max(
          window.innerWidth - (mouseX + (window.innerWidth - rightSideRefPosition.right)),
          MIN_WIDTH
        );

        setResize((c) => ({
          ...c,
          width: newWidth,
        }));
        parentCallbackWidthDebounce(children.props.id, newWidth);
      }
    },
    [resize, parentCallbackWidthDebounce, children.props.id]
  );

  useEffect(() => {
    setResize((c) => ({ ...c, width: rightSideRef.current.getBoundingClientRect().width }));
  }, [rightSideRef]);

  useEffect(() => {
    parentCallbackWidth(children.props.id, rightSideRef.current.getBoundingClientRect().width);
  }, [parentCallbackWidth, children.props.id]);

  useEffect(() => {
    const savedTimer = timer.current;
    return () => clearTimeout(savedTimer);
  }, [parentCallbackWidth]);

  return (
    <>
      <ResizeDevider
        ref={ResizeDeviderRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        active={resize.active}
        width={6}
        dimmer
      >
        <div />
      </ResizeDevider>
      <div ref={rightSideRef}>
        {React.Children?.map(children, (child) => {
          return React.isValidElement(child)
            ? React.cloneElement(child, { width: resize.width, style: { width: resize.width } })
            : child;
        })}
      </div>

      {resize.active && (
        <BackDrop transparent onMouseMove={handleResize} onMouseUp={handleMouseUp} />
      )}
    </>
  );
};

export default ResizeWrapper;
