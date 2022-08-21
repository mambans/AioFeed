import React, { useEffect, useRef } from 'react';
import StyledLoadingList from './../categoryTopStreams/LoadingList';

const InifinityScroll = ({ observerFunction }) => {
  const ref = useRef();
  const timer = useRef();

  useEffect(() => {
    if (observerFunction) {
      const elementRef = ref.current;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting === true) {
            clearTimeout(timer.current);
            timer.current = setTimeout(async () => {
              if (entries[0].isIntersecting === true)
                await observerFunction(entries)?.catch?.((e) => {
                  observer.unobserve(elementRef);
                });
            }, 750);
          }
        },
        { threshold: 0.5 }
      );

      elementRef && observer.observe(elementRef);

      return () => {
        clearTimeout(timer.current);
        elementRef && observer.unobserve(elementRef);
      };
    }
  }, [observerFunction]);

  return (
    <div ref={ref} className='loading'>
      <StyledLoadingList amount={2} style={{ paddingLeft: '10px' }} />
    </div>
  );
};
export default InifinityScroll;
