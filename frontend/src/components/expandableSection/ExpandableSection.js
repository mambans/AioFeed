import React, { useEffect, useRef, useState } from 'react';
import { StyledExpandSection } from './styledComponents';

const ExpandableSection = ({ collapsed, children, isOpened, unmountOnInitialClosed, ...rest }) => {
  const ref = useRef();
  const [height, setHeight] = useState({ collapsed });
  const [initialLoad, setInitialLoad] = useState(unmountOnInitialClosed ? false : true);
  const timer = useRef();

  useEffect(() => {
    clearTimeout(timer.current);
    setInitialLoad(false);
    setHeight({
      height: ref.current?.getBoundingClientRect()?.height + 'px',
      isOpened: false,
      willChange: true,
    });
    requestAnimationFrame(() => {
      setHeight((c) => ({
        ...c,
        height: ref.current?.getBoundingClientRect()?.height + 'px',
        collapsed,
      }));
    });

    timer.current = setTimeout(() => {
      requestAnimationFrame(() => {
        setHeight((c) => {
          if (!c.collapsed) {
            return { height: 'unset', collapsed: c.collapsed, isOpened: true, willChange: false };
          }
          return { ...c, willChange: false };
        });
      });
    }, 501);
  }, [collapsed]);

  return (
    <StyledExpandSection
      {...rest}
      isOpened={height?.isOpened}
      height={height?.height}
      collapsed={String(height?.collapsed)}
      willChange={String(height?.willChange)}
    >
      <div ref={ref}>{(!initialLoad || height?.isOpened) && children}</div>
    </StyledExpandSection>
  );
};
export default ExpandableSection;
