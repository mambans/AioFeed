import React, { useContext } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import FeedsCenterContainer from '../feed/FeedsCenterContainer';
import FeedsContext from '../feed/FeedsContext';
import { Container } from '../twitch/StyledComponents';

import AlertHandler from './../alert';
import YoutubeDataHandler from './../youtube/Datahandler';
import YoutubeHeader from './../youtube/Header';
import YoutubeHandler from './YoutubeHandler';

const YoutubeStandalone = () => {
  useDocumentTitle('YouTube');

  return (
    <FeedsCenterContainer left={false} right={false}>
      <Youtube className='feed' />
    </FeedsCenterContainer>
  );
};

export const Youtube = ({ className }) => {
  const { orders } = useContext(FeedsContext);

  return (
    <YoutubeDataHandler>
      {(data) => (
        <Container order={orders['youtube']} className={className}>
          <YoutubeHeader
            videos={data.videos}
            setVideos={data.setVideos}
            refresh={data.refresh}
            isLoaded={data.isLoaded}
            requestError={data.requestError}
            followedChannels={data.followedChannels}
          />

          {data.error && <AlertHandler data={data.error}></AlertHandler>}

          <YoutubeHandler requestError={data.requestError} videos={data.videos} />
        </Container>
      )}
    </YoutubeDataHandler>
  );
};

export default YoutubeStandalone;
