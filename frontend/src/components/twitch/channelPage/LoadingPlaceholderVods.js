import React from 'react';

import { SubFeedContainer } from './../../sharedComponents/sharedStyledComponents';
import LoadingBoxes from './../LoadingBoxes';
import SortButton from './SortButton';
import { SubFeedHeader } from './StyledComponents';

export default ({ numberOfVideos }) => (
  <>
    <SubFeedHeader
      style={{
        width: `${numberOfVideos * 350}px`,
      }}
    >
      <SortButton sortBy={''} />
      <h3>Vods</h3>
    </SubFeedHeader>
    <SubFeedContainer style={{ justifyContent: 'center', minHeight: '345px', paddingBottom: '0' }}>
      <LoadingBoxes amount={numberOfVideos} type='small' />
    </SubFeedContainer>
  </>
);
