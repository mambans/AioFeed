import React, { useRef, useState } from 'react';
import { MdMovieCreation, MdLiveTv } from 'react-icons/md';
import { Link } from 'react-router-dom';
import useClicksOutside from '../../../hooks/useClicksOutside';

import { TypeListUlContainer, StyledTypeButton } from './styledComponents';

const TypeButton = ({ category, videoType, setSortBy, setTopData, oldTopData, setVideoType }) => {
  const [typeListOpen, setTypeListOpen] = useState(false);
  const ref = useRef();
  useClicksOutside(ref, () => setTypeListOpen(false), typeListOpen);

  const videoTypeBtnOnClick = (type) => {
    setTopData([]);
    oldTopData.current = null;
    setVideoType(type);
    setTypeListOpen(false);
  };

  return (
    <div ref={ref}>
      <StyledTypeButton
        title={category ? `Fetch top ${videoType}` : 'Select a game/category first'}
        disabled={category ? false : true}
        onClick={() => setTypeListOpen(!typeListOpen)}
      >
        {!videoType || videoType === 'streams' ? (
          <MdLiveTv size={20} />
        ) : (
          <MdMovieCreation size={22} />
        )}
        {videoType}
      </StyledTypeButton>

      {typeListOpen && (
        <TypeListUlContainer>
          <Link to='?type=streams' onClick={() => videoTypeBtnOnClick('streams')}>
            <MdLiveTv size={24} />
            Streams
          </Link>
          <Link
            to='?type=clips'
            onClick={() => {
              videoTypeBtnOnClick('clips');
              setSortBy('Views');
            }}
          >
            <MdMovieCreation size={24} />
            Clips
          </Link>
        </TypeListUlContainer>
      )}
    </div>
  );
};
export default TypeButton;
