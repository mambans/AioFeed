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
    let request = window.indexedDB.open("Notifies", 1),
      db,
      tx,
      store,
      index;

    request.onupgradeneeded = function(event) {
      let db = request.result,
        store = db.createObjectStore("TwitchProfiles", { keyPath: "user_id" }),
        index = store.createIndex("user_id", "user_id", { unique: false });
    };

    request.onerror = function(event) {
      alert("error opening database " + event.target.errorCode);
    };

    request.onsuccess = function(event) {
      db = request.result;
      db.onerror = function(event) {
        console.log("Error: ", event.target.errorCode);
      };

      // async function getAllVideos() {
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

        console.log("TCL: getAllVideos -> videosUnordered", videosUnordered);
        // videos = videosUnordered;
      });
      // }

      // getAllVideos();
    };

    await getVideoInfo(videosUnordered);
    liveStreams.forEach(ele => {
      videosUnordered.push(ele);
    });

    console.log("TCL: getSubscriptionVideos -> videos", videos);
    videos = _.reverse(_.sortBy(videosUnordered, d => d.snippet.publishedAt));

    console.log("--videos: ", videos);

    return { data: videos, error: error };
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default getSubscriptionVideos;
