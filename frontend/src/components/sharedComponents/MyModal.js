import React, { useEffect, useRef, useState } from 'react';
import { TransparentButton } from './sharedStyledComponents';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import { FaRegWindowRestore } from 'react-icons/fa';
import { Portal } from 'react-portal';
// import useClicksOutside from '../../hooks/useClicksOutside';

/**
 *
 * @param {Element} [trigger = <FaRegWindowRestore />] - Element to act as trigger element
 * @param {Boolean} [show] - Value to show the modal manually (external trigger button) instead of the buildin trigger button.
 * @param {Boolean} [closeOnRequest = true] - Close modal on clickoutside and ESC key.
 * @param {String} [direction] - Direction of the modal to slide too
 * @param {Number} [duration] - Duration of the animation
 * @param {Object} [triggerStyle] - Style for the trigger button
 * @param {Object} [style] - Style for the modal
 * @param {Elements} [children] - Childrens in the modal
 * @returns
 */
const MyModal = ({
  trigger = <FaRegWindowRestore size={20} />,
  show: open,
  closeOnRequest = true,
  direction,
  duration = 500,
  triggerStyle,
  children,
  style,
  onMouseEnter = () => {},
  onMouseOver = () => {},
  onMouseOut = () => {},
  onMouseLeave = () => {},
  ...props
}) => {
  const [show, setShow] = useState(open);
  const [triggerRefPositions, setTriggerRefPositions] = useState();
  const triggerBtnRef = useRef();
  const ref = useRef();

  // eslint-disable-next-line no-unused-vars
  const handleOpen = () => {
    setShow(true);
    props?.handleOpen?.();
  };
  const handleToggle = () => {
    setShow((c) => {
      if (!c) props?.handleOpen?.();
      if (c) props?.handleClose?.();
      return !c;
    });
  };
  const handleClose = () => {
    setShow(false);
    props?.handleClose?.();
  };
  useEventListenerMemo(
    'keydown',
    (e) => e.key === 'Escape' && handleClose(),
    window,
    closeOnRequest && show
  );

  useEffect(() => setTriggerRefPositions(triggerBtnRef?.current?.getBoundingClientRect?.()), []);
  useEffect(() => setShow(open), [open]);

  const animationDirection = () => {
    switch (direction) {
      case 'left':
        return 'translate(100%, 0)';
      case 'right':
        return 'translate(-100%, 0)';
      case 'top':
      case 'up':
        return 'translate(0, 100%)';
      case 'bottom':
      case 'down':
        return 'translate(0, -100%)';
      default:
        return;
      // return 'translate(0, 0)';
    }
  };

  return (
    <>
      <Container ref={ref}>
        <TriggerButton
          onClick={handleToggle}
          ref={triggerBtnRef}
          style={triggerStyle}
          onMouseEnter={onMouseEnter}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          onMouseLeave={onMouseLeave}
        >
          {trigger}
        </TriggerButton>

        <CSSTransition
          in={show}
          timeout={direction ? duration : 0}
          classNames='slideLeft'
          unmountOnExit
          appear
        >
          <Portal>
            <SModal
              refPos={triggerRefPositions}
              direction={animationDirection()}
              style={style}
              duration={duration}
            >
              {children}
            </SModal>
          </Portal>
        </CSSTransition>
        {show && (
          <Portal>
            <Backdrop onClick={handleClose} />
          </Portal>
        )}
      </Container>
    </>
  );
};
export default MyModal;

const TriggerButton = styled(TransparentButton)`
  &,
  svg {
    transition: color 250ms, scale 250ms;
    color: rgb(150, 150, 150);
  }

  &:hover {
    transform: scale(1.1);
    svg {
      color: #ffffff;
    }
  }
`;
const Container = styled.div`
  position: relative;
`;
const SModal = styled.div`
  position: absolute;
  z-index: 999999;
  pointer-events: initial;

  &.slideLeft-appear {
    opacity: 0;
    transform: ${({ direction }) => direction};
    transition: opacity ${({ duration }) => duration / 2 + 'ms'},
      transform ${({ duration }) => duration + 'ms'};
  }
  &.slideLeft-appear-active {
    opacity: 1;
    transform: translate(0, 0);
    transition: opacity ${({ duration }) => duration / 2 + 'ms'},
      transform ${({ duration }) => duration + 'ms'};
    pointer-events: none;
  }

  &.slideLeft-enter {
    opacity: 0;
    transform: ${({ direction }) => direction};
    transition: opacity ${({ duration }) => duration / 2 + 'ms'},
      transform ${({ duration }) => duration + 'ms'};
  }

  &.slideLeft-enter-active {
    opacity: 1;
    transform: translate(0, 0);
    transition: opacity ${({ duration }) => duration / 2 + 'ms'},
      transform ${({ duration }) => duration + 'ms'};
    pointer-events: none;
  }

  &.slideLeft-exit {
    opacity: 1;
    transform: translate(0, 0);
    transition: opacity ${({ duration }) => duration / 2 + 'ms'},
      transform ${({ duration }) => duration + 'ms'};
  }

  &.slideLeft-exit-active {
    opacity: 0;
    transform: ${({ direction }) => direction};
    transition: opacity ${({ duration }) => duration / 2 + 'ms'},
      transform ${({ duration }) => duration + 'ms'};
    pointer-events: none;
  }

  &.slideLeft-exit-done {
    opacity: 0;
    transform: ${({ direction }) => direction};
    transition: opacity ${({ duration }) => duration / 2 + 'ms'},
      transform ${({ duration }) => duration + 'ms'};
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: transparent;
  z-index: 100;
`;
