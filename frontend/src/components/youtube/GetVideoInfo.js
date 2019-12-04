import axios from "axios";
import moment from "moment";

async function getVideoInfo(videoList) {
  const detailsCached = localStorage.getItem("YouTubeVideoDetails")
    ? JSON.parse(localStorage.getItem("YouTubeVideoDetails"))
    : {};

  await Promise.all(
    await Object.values(videoList).map(async channel => {
      await channel.items.map(async video => {
        try {
          if (!video.duration) {
            console.log("-----details req sent-------");
            const response = await axios.get(
              `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${video.contentDetails.upload.videoId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
            );

            const setDuration = await moment
              .duration(response.data.items[0].contentDetails.duration)
              .format("hh:mm:ss");

            // const setDuration = "1:02:033";

            // detailsCached[video.contentDetails.upload.videoId] = { duration: setDuration };

            video.duration = setDuration;
          } else {
            // video.duration = detailsCached[video.contentDetails.upload.videoId].duration;
          }
        } catch (e) {
          console.log("-------details CAHCE used------");
          // console.log("TCL: getVideoInfo -> e", e);
        }
        return video;
      });
      return channel.items;
    })
  );

  // const res = await Promise.all(
  //   Object.keys(videoList).map(async (channel, index) => {
  //     console.log("TCL: getVideoInfo -> videoList[channel]", videoList[channel]);
  //     const res = await videoList[channel].items.map(async video => {
  //       // console.log(Object.keys(video));
  //       // console.log("TCL: getVideoInfo -> video", video);
  //       // console.log("TCL: getVideoInfo -> video.duration", video.hasOwnProperty("duration"));
  //       // console.log("TCL: getVideoInfo -> video.duration", video.duration);

  //       try {
  //         if (
  //           detailsCached[video.contentDetails.upload.videoId] &&
  //           !detailsCached[video.contentDetails.upload.videoId].duration
  //         ) {
  //           console.log("-----details req sent-------");
  //           // detailsCached[video.contentDetails.upload.videoId] = {};
  //           // detailsCached[video.contentDetails.upload.videoId].duration = "1:02:30";
  //           // video.duration = "1:02:30";

  //           const response = await axios.get(
  //             `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${video.contentDetails.upload.videoId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
  //           );

  //           const setDuration = moment
  //             .duration(response.data.items[0].contentDetails.duration)
  //             .format("hh:mm:ss");

  //           detailsCached[video.contentDetails.upload.videoId] = {};
  //           detailsCached[video.contentDetails.upload.videoId].duration = setDuration;
  //           video.duration = setDuration;
  //         } else {
  //           video.duration = detailsCached[video.contentDetails.upload.videoId].duration || "";

  //           console.log("-------details CAHCE used------");
  //         }
  //         return video;
  //       } catch (e) {
  //         console.error(e.message);
  //       }
  //     });
  //     console.log("TCL: getVideoInfoADASDASDASDASDASDASD -> res", res);

  //     return res;
  //   })
  // )
  // .then(res => {
  //   console.log("TCL: getVideoInfo.---- -> res", res);
  //   localStorage.setItem("YouTubeVideoDetails", JSON.stringify(res));
  // })
  // .catch(error => {
  //   console.log(error);
  // });

  console.log("TCL: getVideoInfo -> videoList2", videoList);
  return videoList;
}

export default getVideoInfo;
