import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ThemeContext from '../../components/themes/ThemeContext';
import useEventListenerMemo from '../../hooks/useEventListenerMemo';
import { LoadingPlaceholder } from './StyledComponents';
import TwitterContext from './TwitterContext';

const Timelines = ({ id, mainContainerRef }) => {
  const [loading, setLoading] = useState();
  const containerRef = useRef();
  const { activeTheme } = useContext(ThemeContext) || {};
  const { refreshOnFocusEnabled } = useContext(TwitterContext) || {};

  // const onFocus = () => {
  //   // if (containerRef.current.firstChild) addTimeline();
  // };

  function onVisibilityChange() {
    console.log('onVisibilityChange:', document.visibilityState);
    if (containerRef.current.firstChild && document.visibilityState === 'visible') addTimeline();
  }

  // useEventListenerMemo('focus', onFocus, window, refreshOnFocusEnabled);
  useEventListenerMemo('visibilitychange', onVisibilityChange, window, refreshOnFocusEnabled);

  const addTimeline = useCallback(() => {
    setLoading(true);
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
        if (containerRef.current && containerRef.current.childNodes) {
          while (containerRef.current.childNodes.length > 1) {
            if (containerRef.current.firstChild)
              containerRef.current.removeChild(containerRef.current.firstChild);
          }
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
