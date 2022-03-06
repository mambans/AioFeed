import React, { useContext, useState, useMemo } from 'react';
import debounce from 'lodash/debounce';

import FeedsContext from '../../feed/FeedsContext';
import { StyledFeedSizeSlider } from '../StyledComponents';

const FeedSizeSlider = () => {
  const { setFeedSize, feedSize, enableTwitch, enableTwitchVods, enableYoutube, enableMyLists } =
    useContext(FeedsContext) || {};
  const [sizeValue, setSizeValue] = useState(feedSize);

  const delayedHandleChange = useMemo(
    () => debounce((v) => setFeedSize(v), 250, { maxWait: 500 }),
    [setFeedSize]
  );

  const handleChange = (v) => {
    setSizeValue(v.target.value);
    delayedHandleChange(v.target.value);
  };

  if (enableTwitch || enableTwitchVods || enableYoutube || enableMyLists) {
    return (
      <StyledFeedSizeSlider>
        {`Feed video size: ${sizeValue}`}
        <input
          defaultValue={sizeValue}
          onChange={handleChange}
          type='range'
          className='form-range'
          min='30'
          max='100'
        />
      </StyledFeedSizeSlider>
    );
  }
  return null;
};

export default FeedSizeSlider;
