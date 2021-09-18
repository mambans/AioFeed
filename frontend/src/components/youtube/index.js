import React, { useState } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { getLocalstorage } from '../../util';
import FeedsCenterContainer from '../feed/FeedsCenterContainer';
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
  const [order, setOrder] = useState(getLocalstorage('FeedOrders')?.['Youtube'] ?? 18);

  return (
    <YoutubeDataHandler>
      {(data) => (
        <Container order={order} className={className}>
          <YoutubeHeader
            videos={data.videos}
            setVideos={data.setVideos}
            refresh={data.refresh}
            isLoaded={data.isLoaded}
            requestError={data.requestError}
            followedChannels={data.followedChannels}
            setOrder={setOrder}
          />

          {data.error && <AlertHandler data={data.error}></AlertHandler>}

          <YoutubeHandler requestError={data.requestError} videos={data.videos} />
        </Container>
      )}
    </YoutubeDataHandler>
  );
};

export default YoutubeStandalone;
