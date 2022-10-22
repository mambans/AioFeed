import { GrPowerReset } from 'react-icons/gr';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';

import { StyledLoadmore } from './styledComponents';
import CountdownCircleTimer from '../CountdownCircleTimer';

const LoadMore = React.forwardRef(
  ({ style = {}, onClick, onReset, loading: isLoading, onShowAll, reachedEnd, text }, ref) => {
    const thisEleRef = useRef();
    const [loading, setLoading] = useState(isLoading);

    useImperativeHandle(ref, () => ({
      setLoading(a) {
        setLoading(a);
      },
    }));

    useEffect(() => {
      setLoading(isLoading);
    }, [isLoading, setLoading]);

    const onClickFunc = () => {
      observer.current.observe(thisEleRef.current);
      onClick();
    };

    const observer = useRef(
      new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting === false) {
            setTimeout(() => {
              if (thisEleRef.current) {
                thisEleRef.current.scrollIntoView({
                  behavior: 'smooth',
                  block: 'end',
                  inline: 'nearest',
                });
                observer.current.unobserve(thisEleRef.current);
              }
            }, 0);
          }
        },
        { threshold: 0.8 }
      )
    );

    useEffect(() => {
      const thisEle = thisEleRef.current;
      const observerRef = observer.current;
      return () => {
        observerRef?.unobserve(thisEle);
      };
    }, []);

    const loadMoreEle = (() => {
      if (reachedEnd) return null;
      if (loading)
        return (
          <>
            Loading..
            <CountdownCircleTimer isLoading={true} style={{ marginLeft: '10px' }} size={18} />
          </>
        );
      return text || 'Load more';
    })();

    return (
      <StyledLoadmore ref={thisEleRef} style={style} size={18}>
        <div className='line' />
        <div className='button' onClick={onClickFunc}>
          {loadMoreEle}
        </div>
        {onShowAll && (
          <div className='button' onClick={onShowAll}>
            Show all
          </div>
        )}
        <div className='line' />
        {onReset && (
          <GrPowerReset size={20} title='Show less (reset)' id='reset' onClick={onReset} />
        )}
      </StyledLoadmore>
    );
  }
);

export default LoadMore;
