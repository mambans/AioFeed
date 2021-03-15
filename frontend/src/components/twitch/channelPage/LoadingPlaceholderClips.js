import React from 'react';

import { SubFeedContainer } from './../../sharedStyledComponents';
import LoadingBoxes from './../LoadingBoxes';
import { SubFeedHeader } from './StyledComponents';

export default ({ numberOfVideos }) => (
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
