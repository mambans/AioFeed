import React from 'react';
import FeedsCenterContainer from '../feed/FeedsCenterContainer';

import AlertHandler from './../alert';
import YoutubeDataHandler from './../youtube/Datahandler';
import YoutubeHeader from './../youtube/Header';
import YoutubeHandler from './YoutubeHandler';

export default ({ disableContextProvider }) => (
  <FeedsCenterContainer>
    <Youtube disableContextProvider={disableContextProvider} />
  </FeedsCenterContainer>
);

export const Youtube = ({ disableContextProvider }) => {
  return (
    <YoutubeDataHandler>
      {(data) => (
        <>
          <YoutubeHeader
            videos={data.videos}
            setVideos={data.setVideos}
            refresh={data.refresh}
            isLoaded={data.isLoaded}
            requestError={data.requestError}
            followedChannels={data.followedChannels}
          />

          {data.error && <AlertHandler data={data.error}></AlertHandler>}

          <YoutubeHandler
            requestError={data.requestError}
            videos={data.videos}
            disableContextProvider={disableContextProvider}
          />
        </>
      )}
    </YoutubeDataHandler>
  );
};
