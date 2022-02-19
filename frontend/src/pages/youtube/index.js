import React, { useContext } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import FeedsCenterContainer from '../feed/FeedsCenterContainer';
import FeedsContext from '../feed/FeedsContext';
import ExpandableSection from '../../components/expandableSection/ExpandableSection';
import { Container } from '../twitch/StyledComponents';

import YoutubeDataHandler from './../youtube/Datahandler';
import YoutubeHeader from './../youtube/Header';
import YoutubeHandler from './YoutubeHandler';
import Alert from '../../components/alert';

const YoutubeStandalone = () => {
  useDocumentTitle('YouTube');

  return (
    <FeedsCenterContainer left={false} right={false}>
      <Youtube className='feed' />
    </FeedsCenterContainer>
  );
};

export const Youtube = ({ className }) => {
  const { orders, toggleExpanded } = useContext(FeedsContext);

  return (
    <YoutubeDataHandler>
      {(data) => (
        <Container order={orders?.['youtube']?.order} className={className}>
          <YoutubeHeader
            videos={data.videos}
            setVideos={data.setVideos}
            refresh={data.refresh}
            isLoaded={data.isLoaded}
            requestError={data.requestError}
            followedChannels={data.followedChannels}
            collapsed={orders?.['youtube']?.collapsed}
            toggleExpanded={() => toggleExpanded('youtube')}
          />

          {data.error && <Alert data={data.error}></Alert>}
          <ExpandableSection collapsed={orders?.['youtube']?.collapsed}>
            <YoutubeHandler requestError={data.requestError} videos={data.videos} />
          </ExpandableSection>
        </Container>
      )}
    </YoutubeDataHandler>
  );
};

export default YoutubeStandalone;
