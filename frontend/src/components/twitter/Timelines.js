import React, { useContext, useEffect, useRef, useState } from 'react';
import ThemeContext from '../themes/ThemeContext';
import { LoadingPlaceholder } from './StyledComponents';

const Timelines = ({ id, mainContainerRef }) => {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();
  const { activeTheme } = useContext(ThemeContext) || {};

  useEffect(() => {
    if (!window.twttr) {
      console.error('Failure to load window.twttr in TwitterTimelineEmbed, aborting load.');
      return;
    }

    const parentHeight = mainContainerRef.current.clientHeight;
    const options = {
      chrome: 'noheader, nofooter, noborders, transparent, noscrollbar',
      dnt: false,
      height: parentHeight,
      theme: activeTheme?.type || 'dark',
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
      .then(() => setLoading(false));
  }, [id, mainContainerRef, activeTheme]);

  return <div ref={containerRef}>{loading && <LoadingPlaceholder />}</div>;
};

export default Timelines;
