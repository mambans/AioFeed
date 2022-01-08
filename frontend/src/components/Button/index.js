import React, { useEffect, useRef, useState } from 'react';
import { LoadingDiv, Inner, StyledButton, LoadingDivTransparent } from './styledComponents';

const Button = ({
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
  ...rest
}) => {
  const [active, setActive] = useState(false);
  const [data, setData] = useState({ backgroundColor, color, children, variant });
  const resetTimer = useRef();
  const resetDataTimer = useRef();
  const ref = useRef();

  const handleOnClick = (e) => {
    onClick(e);
    clearTimeout(resetTimer.current);
    setActive(true);
    resetTimer.current = setTimeout(() => {
      setActive(false);
    }, duration);
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

  return (
    <StyledButton
      ref={ref}
      onClick={handleOnClick}
      active={active}
      duration={duration}
      backgroundColor={data.backgroundColor}
      color={data.color}
      iconActiveColor={iconActiveColor}
      variant={data.variant}
      disableClickAnimation={disableClickAnimation}
      // disabled={disabled}
      // tempDisabled={active || loading}

      {...rest}
    >
      {loading &&
        (variant === 'transparent' ? (
          <LoadingDivTransparent variant={variant} />
        ) : (
          <LoadingDiv key={'loading'} parent={ref?.current?.getBoundingClientRect()} />
        ))}
      <Inner>{data.children}</Inner>
    </StyledButton>
  );
};
export default Button;
