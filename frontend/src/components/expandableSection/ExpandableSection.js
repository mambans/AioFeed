import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyledExpandSection } from './styledComponents';

const ExpandableSection = ({ collapsed, children, isOpened, unmountOnInitialClosed, ...rest }) => {
  const ref = useRef();
  const [height, setHeight] = useState({ collapsed });
  const [initialLoad, setInitialLoad] = useState(unmountOnInitialClosed ? true : false);
  const animationFrame = useRef();

  const onTransitionEnd = (e) => {
    if (e.propertyName === 'height') {
      setHeight((c) => {
        if (!c.collapsed) {
          return {
            height: 'unset',
            collapsed: c.collapsed,
            isOpened: true,
            willChange: false,
          };
        }
        return { ...c, willChange: false };
      });
    }
  };

  useLayoutEffect(() => {
    cancelAnimationFrame(animationFrame.current);
    setInitialLoad(false);
    setHeight({
      height: ref.current?.getBoundingClientRect()?.height + 'px',
      isOpened: false,
      willChange: true,
    });
  }, [collapsed]);

  useEffect(() => {
    animationFrame.current = requestAnimationFrame(() => {
      setHeight((c) => ({
        ...c,
        height: ref.current?.getBoundingClientRect()?.height + 'px',
        collapsed,
      }));
    });
  }, [collapsed]);

  useEffect(() => {
    setTimeout(() => {
      onTransitionEnd({ propertyName: 'height' });
    }, 0);
  }, []);

  return (
    <StyledExpandSection
      {...rest}
      isOpened={height?.isOpened}
      height={height?.height}
      collapsed={String(height?.collapsed)}
      willChange={String(height?.willChange)}
      onTransitionEnd={onTransitionEnd}
    >
      <div ref={ref}>{(!initialLoad || height?.isOpened) && children}</div>
    </StyledExpandSection>
  );
};
export default ExpandableSection;
