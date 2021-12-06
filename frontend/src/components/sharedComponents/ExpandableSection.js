import React, { useEffect, useRef, useState } from 'react';
import { StyledExpandSection } from './sharedStyledComponents';

const ExpandableSection = ({ collapsed, children, ...rest }) => {
  const ref = useRef();
  const [height, setHeight] = useState({ collapsed });
  const timer = useRef();

  useEffect(() => {
    clearTimeout(timer.current);
    setHeight({ height: ref.current?.getBoundingClientRect()?.height + 'px' });
    requestAnimationFrame(() => {
      setHeight({ height: ref.current?.getBoundingClientRect()?.height + 'px', collapsed });
    });

    timer.current = setTimeout(() => {
      // requestAnimationFrame(() => {
      setHeight((c) => {
        if (!c.collapsed) return { height: 'unset', collapsed: c.collapsed };
        return c;
      });
      // });
    }, 501);
  }, [collapsed]);

  return (
    <StyledExpandSection {...rest} height={height?.height} collapsed={String(height?.collapsed)}>
      <div ref={ref}>{children}</div>
    </StyledExpandSection>
  );
};
export default ExpandableSection;
