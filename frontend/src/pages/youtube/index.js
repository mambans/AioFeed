import React from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import FeedsCenterContainer from '../feed/FeedsCenterContainer';
import ExpandableSection from '../../components/expandableSection/ExpandableSection';
import { Container } from '../twitch/StyledComponents';

import YoutubeDataHandler from './../youtube/Datahandler';
import YoutubeHeader from './../youtube/Header';
import YoutubeHandler from './YoutubeHandler';
import Alert from '../../components/alert';
import { useRecoilValue } from 'recoil';
import { feedPreferencesAtom, useFeedPreferences } from '../../atoms/atoms';

const YoutubeStandalone = () => {
  useDocumentTitle('YouTube');

  return (
    <FeedsCenterContainer left={false} right={false}>
      <Youtube className='feed' />
    </FeedsCenterContainer>
  );
};

export const Youtube = ({ className }) => {
  const { toggleExpanded } = useFeedPreferences();
  const feedPreferences = useRecoilValue(feedPreferencesAtom);

  return (
    <YoutubeDataHandler>
      {(data) => (
        <Container
          aria-labelledby='youtube'
          order={feedPreferences?.['youtube']?.order || 500}
          className={className}
        >
          <YoutubeHeader
            videos={data.videos}
            setVideos={data.setVideos}
            refresh={data.refresh}
            isLoaded={data.isLoaded}
            requestError={data.requestError}
            followedChannels={data.followedChannels}
            collapsed={feedPreferences?.['youtube']?.collapsed}
            toggleExpanded={() => toggleExpanded('youtube')}
          />

          {data.error && <Alert data={data.error}></Alert>}
          <ExpandableSection collapsed={feedPreferences?.['youtube']?.collapsed}>
            <YoutubeHandler requestError={data.requestError} videos={data.videos} />
          </ExpandableSection>
        </Container>
      )}
    </YoutubeDataHandler>
  );
};

export default YoutubeStandalone;
