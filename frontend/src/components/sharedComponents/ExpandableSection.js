import React, { useEffect, useRef, useState } from 'react';
import { StyledExpandSection } from './sharedStyledComponents';

const ExpandableSection = ({ collapsed, children, isOpened, ...rest }) => {
  const ref = useRef();
  const [height, setHeight] = useState({ collapsed });
  const timer = useRef();

  useEffect(() => {
    clearTimeout(timer.current);
    setHeight({ height: ref.current?.getBoundingClientRect()?.height + 'px', isOpened: false });
    requestAnimationFrame(() => {
      setHeight({
        height: ref.current?.getBoundingClientRect()?.height + 'px',
        collapsed,
        isOpened: false,
      });
    });

    timer.current = setTimeout(() => {
      // requestAnimationFrame(() => {
      setHeight((c) => {
        if (!c.collapsed) return { height: 'unset', collapsed: c.collapsed, isOpened: true };
        return c;
      });
      // });
    }, 501);
  }, [collapsed]);

  return (
    <StyledExpandSection
      {...rest}
      isOpened={height?.isOpened}
      height={height?.height}
      collapsed={String(height?.collapsed)}
    >
      <div ref={ref}>{children}</div>
    </StyledExpandSection>
  );
};
export default ExpandableSection;
