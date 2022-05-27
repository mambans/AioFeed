import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ThemeContext from '../../components/themes/ThemeContext';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import { LoadingPlaceholder } from './StyledComponents';

const Timelines = ({ id, mainContainerRef }) => {
  const [loading, setLoading] = useState();
  const containerRef = useRef();
  const { activeTheme } = useContext(ThemeContext) || {};

  const onFocus = () => {
    // setRefreshing(true);
    // setTimeout(() => {
    //   setRefreshing(false);
    // }, 10);

    if (containerRef.current.firstChild) addTimeline();
  };

  useEventListenerMemo('focus', onFocus);

  const addTimeline = useCallback(() => {
    if (!window.twttr) {
      console.error('Failure to load window.twttr in TwitterTimelineEmbed, aborting load.');
      return;
    }
    const parentHeight = mainContainerRef.current.clientHeight;
    const options = {
      chrome: 'noheader, nofooter, noborders, transparent, noscrollbar',
      dnt: true,
      height: parentHeight,
      theme: activeTheme?.type || 'dark',
      ariaPolite: 'assertive',
      id: `'list:${id}`,
    };

    window.twttr.widgets
      .createTimeline(
        {
          id: id,
          sourceType: 'list',
        },
        containerRef.current,
        options
      )
      .then(() => {
        while (containerRef.current.childNodes.length > 1) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
        setLoading(false);
      });
  }, [activeTheme?.type, id, mainContainerRef]);

  useEffect(() => {
    addTimeline();
  }, [addTimeline]);

  return (
    <div ref={containerRef} className='Twitter-timeline-container' id={`twitter-list-${id}`}>
      {loading && <LoadingPlaceholder />}
    </div>
  );
};

export default Timelines;
