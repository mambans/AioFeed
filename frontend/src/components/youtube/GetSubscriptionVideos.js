import axios from "axios";
import _ from "lodash";

import getVideoInfo from "./GetVideoInfo";
import Utilities from "./../../utilities/Utilities";

const filterVideos = async response => {
  if (response && response.items && response.items.length > 0) {
    const items = await Promise.all(
      response.items.filter(video => {
        return video.snippet.type === "upload";
      })
    );
    // console.log("TCL: items", items);
    return items;
  } else {
    return [];
  }
};

const fetchSubscriptionData = async (videosCACHE, channel) => {
  const currentDate = new Date();
  const DATE_THRESHOLD = new Date(currentDate.setDate(currentDate.getDate() - 5));

  // let error = null;
  let res = null;

  if (videosCACHE[channel.snippet.resourceId.channelId]) {
    res = await axios
      .get(`https://www.googleapis.com/youtube/v3/activities?`, {
        params: {
          part: "snippet,contentDetails",
          channelId: channel.snippet.resourceId.channelId,
          maxResults: 5,
          publishedAfter: DATE_THRESHOLD.toISOString(),
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
        },
        headers: {
          "If-None-Match": videosCACHE[channel.snippet.resourceId.channelId].etag,
          Authorization: `Bearer ${Utilities.getCookie("Youtube-access_token")}`,
          Accept: "application/json",
        },
      })
      .then(result => {
        return result.data;
      })
      .catch(function(e) {
        // error = e;
        return videosCACHE[channel.snippet.resourceId.channelId];
      });
  } else {
    res = await axios
      .get(`https://www.googleapis.com/youtube/v3/activities?`, {
        params: {
          part: "snippet,contentDetails",
          channelId: channel.snippet.resourceId.channelId,
          maxResults: 5,
          publishedAfter: DATE_THRESHOLD.toISOString(),
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
        },
        headers: {
          Authorization: `Bearer ${Utilities.getCookie("Youtube-access_token")}`,
          Accept: "application/json",
        },
      })
      .then(result => {
        return result.data;
      })
      .catch(function(e) {
        // error = e;
      });

    // console.log("TCL: fetchSubscriptionData -> ressssss", res.data);
    // return res.data;
  }

  return res;
};

async function getSubscriptionVideos(followedChannels) {
  const THRESHOLD_DATE = 5;
  // const videosUnordered = [];
  const DATE_THRESHOLD = new Date();
  DATE_THRESHOLD.setDate(new Date().getDate() - THRESHOLD_DATE);

  let error = null;

  try {
    console.log(localStorage.getItem("YoutubeVideos"));
    console.log(typeof localStorage.getItem("YoutubeVideos"));
    const videosCACHE =
      localStorage.getItem("YoutubeVideos") !== "undefined" &&
      localStorage.getItem("YoutubeVideos") !== undefined &&
      localStorage.getItem("YoutubeVideos") !== "null" &&
      localStorage.getItem("YoutubeVideos") !== null
        ? JSON.parse(localStorage.getItem("YoutubeVideos"))
        : {};
    // console.log("TCL: getSubscriptionVideos -> videosCACHE", videosCACHE);

    // Object.values(videosCACHE).map(channel => {
    //   channel.items.map(item => {
    //     console.log(Object.keys(item));
    //     return "";
    //   });
    //   return "";
    // });

    const videos = {};

    await Promise.all(
      followedChannels.map(async channel => {
        const response = await fetchSubscriptionData(videosCACHE, channel);

        // console.log("TCL: getSubscriptionVideos -> response", response);
        response.items = await filterVideos(response);

        videos[channel.snippet.resourceId.channelId] = response;
      })
    );

    // console.log("TCL: getSubscriptionVideos -> videos", videos);

    // Object.values(videos).map(channel => {
    //   channel.items.map(item => {
    //     console.log(Object.keys(item));
    //     return "";
    //   });
    //   return "";
    // });
    //-----------------------------------------------------
    // const videosWithDetails = {};

    // await Promise.all(
    //   Object.keys(videos).map(async (channel, index) => {
    //     await videos[channel].items.map(async video => {
    //       let response = null;

    //       try {
    //         if (!video.duration) {
    //           console.log("details req sent");
    //           // video.duration = "1:02:30";

    //           response = await axios.get(
    //             `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${video.contentDetails.upload.videoId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
    //           );

    //           video.duration = moment
    //             .duration(response.data.items[0].contentDetails.duration)
    //             .format("hh:mm:ss");
    //         } else {
    //           console.log("details CAHCE used");
    //         }
    //       } catch (e) {
    //         console.error(e.message);
    //       }
    //     });

    //     videosWithDetails[channel] = videos[channel];
    //   })
    // ).catch(error => {
    //   console.log(error);
    // });

    // console.log("TCL: getSubscriptionVideos -> videosWithDetails", videosWithDetails);

    //-----------------------------------------------------

    // const videosWithDetails = await new Promise(async (resolve, reject) => {
    //   await getVideoInfo(videos)
    //     .then(() => {
    //       resolve();
    //     })
    //     .catch(() => {
    //       reject();
    //     });
    // });
    // const videosWithDetails = await getVideoInfo(videos);
    const videosWithDetails = videos;

    // console.log("TCL: getSubscriptionVideos -> videosWithDetails", videosWithDetails);

    localStorage.setItem("YoutubeVideos", JSON.stringify(videosWithDetails));

    let videosUnorderedNew = [];

    await Promise.all(
      Object.values(videos).map(async (channel, index) => {
        // console.log("TCL: getSubscriptionVideos -> videos[key]", videos[key]);
        await channel.items.map(video => {
          videosUnorderedNew.push(video);
          return video;
        });
      })
    );

    // console.log("TCL: getSubscriptionVideos -> videosUnorderedNew", videosUnorderedNew);

    const allVideos = _.reverse(_.sortBy(videosUnorderedNew, video => video.snippet.publishedAt));

    return { data: allVideos, error: error };
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default getSubscriptionVideos;
