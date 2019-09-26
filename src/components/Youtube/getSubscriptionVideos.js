import axios from "axios";
import _ from "lodash";

import getVideoInfo from "./GetVideoInfo";

async function getSubscriptionVideos(followedChannels) {
  const thresholdDate = 3;
  const videosUnordered = [];
  const today = new Date();
  const OnlyVideosAfterDate = new Date();
  OnlyVideosAfterDate.setDate(today.getDate() - thresholdDate);

  //eslint-disable-next-line
  let liveStreams = [];
  let videos = [];
  let error = null;

  try {
    await Promise.all(
      followedChannels.map(async channel => {
        let response = null;

        localStorage.getItem(`activity-${channel.snippet.resourceId.channelId}`)
          ? (response = await axios
              .get(`https://www.googleapis.com/youtube/v3/activities?`, {
                params: {
                  part: "snippet,contentDetails",
                  channelId: channel.snippet.resourceId.channelId,
                  maxResults: 5,
                  publishedAfter: OnlyVideosAfterDate.toISOString(),
                  key: process.env.REACT_APP_YOUTUBE_API_KEY,
                },
                headers: {
                  "If-None-Match": JSON.parse(
                    localStorage.getItem(`activity-${channel.snippet.resourceId.channelId}`)
                  ).data.etag,
                },
              })
              .catch(function(e) {
                error = e;

                return JSON.parse(
                  localStorage.getItem(`activity-${channel.snippet.resourceId.channelId}`)
                );
              }))
          : (response = await axios
              .get(`https://www.googleapis.com/youtube/v3/activities?`, {
                params: {
                  part: "snippet,contentDetails",
                  channelId: channel.snippet.resourceId.channelId,
                  maxResults: 5,
                  publishedAfter: OnlyVideosAfterDate.toISOString(),
                  key: process.env.REACT_APP_YOUTUBE_API_KEY,
                },
              })
              .catch(function(e) {
                error = e;
              }));

        localStorage.setItem(
          `activity-${channel.snippet.resourceId.channelId}`,
          JSON.stringify(response)
        );

        let videosfiltered = response.data.items.filter(video => {
          return video.snippet.type === "upload";
        });

        videosfiltered.forEach(element => {
          videosUnordered.push(element);
        });

        // let liveChannels = await this.GetLiveYoutubeStreams(channel.snippet.channelId);
        // liveChannels.forEach(stream => {
        //     liveStreams.push(stream);
        // });

        // videos = videosUnordered;
      })
    );

    await getVideoInfo(videosUnordered);
    // await liveStreams.forEach(ele => {
    //     videosUnordered.push(ele);
    // });

    videos = _.reverse(_.sortBy(videosUnordered, d => d.snippet.publishedAt));

    return { data: videos, error: error };
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default getSubscriptionVideos;
