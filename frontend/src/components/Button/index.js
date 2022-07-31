import React, { useEffect, useRef, useState } from 'react';
import { LoadingDiv, Inner, StyledButton, LoadingDivTransparent } from './styledComponents';
import { Button as ReactButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

/**
 * Button
 *
 * @param {Element} children - Html elements children
 * @param {Function} onClick - Function
 * @param {Number} [duration = 1000] - Duration of click animation
 * @param {String} backgroundColor - backgroundColor
 * @param {String} color -color
 * @param {String} iconActiveColor - iconActiveColor
 * @param {Boolean} disabled - disabled
 * @param {String} [variant='default'] - Button variant
 * @param {Boolean} loading - loading
 * @param {Boolean} disableClickAnimation - disableClickAnimation
 */

const Button = (props) => {
  const {
    onClick = () => {},
    children,
    duration = 1000,
    backgroundColor,
    color,
    iconActiveColor,
    disabled,
    variant = 'default',
    loading,
    disableClickAnimation,
    to,
    target,
    ...rest
  } = props;
  const [active, setActive] = useState(false);
  const [data, setData] = useState({ backgroundColor, color, children, variant });
  const resetTimer = useRef();
  const resetDataTimer = useRef();
  const ref = useRef();
  const navigate = useNavigate();

  const getUrl = () => {
    if (target === '_blank') {
      const toUrl = (() => {
        if (!to.includes('http') && !to.includes('www')) return window.location.origin + to;
        return to;
      })();
      const url = new URL(toUrl);
      url.searchParams.append('redirect', false);

      return url.toString();
    }
    return to;
  };
  const handleOnClickLink = (newtab) => {
    if (to) {
      if (target === '_blank' || newtab) {
        window.open(getUrl(), '_blank');
        return;
      }
      navigate(getUrl());
    }
  };

  const handleOnClick = (e) => {
    e.stopPropagation();
    onClick?.(e);
    clearTimeout(resetTimer.current);
    setActive(true);
    resetTimer.current = setTimeout(() => {
      setActive(false);
    }, duration);

    handleOnClickLink();
  };

  const onMouseDown = (e) => {
    if (e.button === 1) {
      onClick?.(e);
      e.stopPropagation();
      handleOnClickLink(true);
    }
  };

  useEffect(() => {
    if (
      color === data?.color &&
      backgroundColor === data?.backgroundColor &&
      variant === data?.variant &&
      children === data.children
    )
      return;

    if (active) {
      clearTimeout(resetDataTimer.current);
      resetDataTimer.current = setTimeout(() => {
        setData({ backgroundColor, color, children, variant });
      }, duration);
      return;
    }
    setData({ backgroundColor, color, children, variant });

    return () => {
      clearTimeout(resetDataTimer.current);
      clearTimeout(resetTimer.current);
    };
  }, [
    backgroundColor,
    color,
    children,
    active,
    duration,
    data.children,
    data.color,
    data.backgroundColor,
    data.variant,
    variant,
  ]);

  useEffect(() => {
    setActive(loading);
  }, [loading]);

  if (variant === 'link') {
    return (
      <ReactButton {...props} variant='link'>
        {children}
      </ReactButton>
    );
  }

  return (
    <StyledButton
      ref={ref}
      {...rest}
      onClick={handleOnClick}
      active={active}
      duration={duration}
      backgroundColor={data.backgroundColor}
      color={data.color}
      iconActiveColor={iconActiveColor}
      variant={data.variant}
      disableClickAnimation={disableClickAnimation}
      disabled={disabled || loading}
      onMouseDown={onMouseDown}
      // tempDisabled={active || loading}
      title={getUrl()}
    >
      <>
        {loading &&
          (variant === 'transparent' ? (
            <LoadingDivTransparent variant={variant} />
          ) : (
            <LoadingDiv key={'loading'} parent={ref?.current?.getBoundingClientRect()} />
          ))}
        <Inner>{data.children}</Inner>
      </>
    </StyledButton>
  );
};
export default Button;
