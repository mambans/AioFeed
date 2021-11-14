import React, { useContext } from 'react';
import FeedsContext from '../../feed/FeedsContext';

import { SubFeedContainer } from './../../sharedComponents/sharedStyledComponents';
import LoadingBoxes from './../LoadingBoxes';
import { SubFeedHeader } from './StyledComponents';

const LoadingPlaceholderVods = ({ numberOfVideos, title = 'Vods', freeze }) => {
  const { feedVideoSizeProps } = useContext(FeedsContext) || {};
  return (
    <>
      <SubFeedHeader
        style={{
          width: `${numberOfVideos * feedVideoSizeProps?.totalWidth}px`,
        }}
      >
        <h3>{title}</h3>
      </SubFeedHeader>
      <SubFeedContainer
        style={{ justifyContent: 'center', minHeight: '345px', paddingBottom: '0' }}
      >
        <LoadingBoxes amount={numberOfVideos} type='small' freeze={freeze} />
      </SubFeedContainer>
    </>
  );
};
export default LoadingPlaceholderVods;
