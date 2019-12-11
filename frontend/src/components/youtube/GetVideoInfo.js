import axios from "axios";
import moment from "moment";

async function getVideoInfo(videoList) {
  const detailsCached = localStorage.getItem("YT-VideoDetails")
    ? JSON.parse(localStorage.getItem("YT-VideoDetails"))
    : {};

  const durations = {};

  await Promise.all(
    await Object.values(videoList).map(async channel => {
      await channel.items.map(async video => {
        try {
          if (!detailsCached[video.contentDetails.upload.videoId]) {
            console.log("---Details req sent---");
            const response = await axios.get(
              `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${video.contentDetails.upload.videoId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
            );

            const setDuration = await moment
              .duration(response.data.items[0].contentDetails.duration)
              .format("hh:mm:ss");

            video.duration = setDuration;
            durations[video.contentDetails.upload.videoId] = setDuration;
          } else {
            console.log(":::Details CAHCE used:::");

            durations[video.contentDetails.upload.videoId] =
              detailsCached[video.contentDetails.upload.videoId];

            video.duration = detailsCached[video.contentDetails.upload.videoId];
          }
        } catch (e) {
          console.log(":::Details CAHCE used:::");
        }
        return video;
      });
      return channel.items;
    })
  );

  await localStorage.setItem("YT-VideoDetails", JSON.stringify(durations));

  return videoList;
}

export default getVideoInfo;
