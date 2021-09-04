import React from 'react';

import { SubFeedContainer } from './../../sharedComponents/sharedStyledComponents';
import LoadingBoxes from './../LoadingBoxes';
import { SubFeedHeader } from './StyledComponents';

const LoadingPlaceholderVods = ({ numberOfVideos, title = 'Vods', freeze }) => (
  <>
    <SubFeedHeader
      style={{
        width: `${numberOfVideos * 350}px`,
      }}
    >
      <h3>{title}</h3>
    </SubFeedHeader>
    <SubFeedContainer style={{ justifyContent: 'center', minHeight: '345px', paddingBottom: '0' }}>
      <LoadingBoxes amount={numberOfVideos} type='small' freeze={freeze} />
    </SubFeedContainer>
  </>
);
export default LoadingPlaceholderVods;
