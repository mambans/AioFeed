import React from 'react';

import { SubFeedContainer } from './../../sharedComponents/sharedStyledComponents';
import LoadingBoxes from './../LoadingBoxes';
import { SubFeedHeader } from './StyledComponents';

const LoadingPlaceholderClips = ({ numberOfVideos }) => (
  <>
    <SubFeedHeader
      style={{
        width: `${numberOfVideos * 350}px`,
      }}
    >
      <h3>Clips</h3>
    </SubFeedHeader>

    <SubFeedContainer style={{ justifyContent: 'center', minHeight: '310px', paddingBottom: '0' }}>
      <LoadingBoxes amount={numberOfVideos} type='big' />
    </SubFeedContainer>
  </>
);
export default LoadingPlaceholderClips;
