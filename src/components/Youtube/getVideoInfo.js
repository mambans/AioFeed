import axios from "axios";

import Utilities from "../../utilities/Utilities";

async function getVideoInfo(videoList) {
  await Promise.all(
    Object.values(videoList).map(async video => {
      let response = null;

      if (!localStorage.getItem(`videoDetails-${video.contentDetails.upload.videoId}`)) {
        response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${video.contentDetails.upload.videoId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        );

        localStorage.setItem(
          `videoDetails-${video.contentDetails.upload.videoId}`,
          JSON.stringify(response)
        );
      } else {
        response = JSON.parse(
          localStorage.getItem(`videoDetails-${video.contentDetails.upload.videoId}`)
        );
      }

      videoList.find(videoo => {
        return videoo.contentDetails.upload.videoId === response.data.items[0].id;
      }).duration = await Utilities.formatDuration(response.data.items[0].contentDetails.duration);
    })
  );

  return videoList;
}

export default getVideoInfo;
