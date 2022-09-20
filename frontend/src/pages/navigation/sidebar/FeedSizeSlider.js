import React, { useState, useMemo } from 'react';
import debounce from 'lodash/debounce';

import { StyledFeedSizeSlider } from '../StyledComponents';
import { useRecoilState, useRecoilValue } from 'recoil';
import { feedPreferencesAtom, feedVideoSizeAtom } from '../../../atoms/atoms';

const FeedSizeSlider = () => {
  const { twitch, vods, youtube, mylists } = useRecoilValue(feedPreferencesAtom) || {};

  const [feedSize, setFeedSize] = useRecoilState(feedVideoSizeAtom);
  const [sizeValue, setSizeValue] = useState(feedSize);

  const delayedHandleChange = useMemo(
    () => debounce((v) => setFeedSize(v), 250, { maxWait: 500 }),
    [setFeedSize]
  );

  const handleChange = (v) => {
    setSizeValue(v.target.value);
    delayedHandleChange(v.target.value);
  };

  if (twitch?.enabled || vods?.enabled || youtube?.enabled || mylists?.enabled) {
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
