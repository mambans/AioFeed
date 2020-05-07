import axios from "axios";
import moment from "moment";
import { getLocalstorage } from "../../util/Utils";

export default async (flattedVideosArray) => {
  const videosArray = [...flattedVideosArray];
  const detailsCached =
    getLocalstorage("YT-VideoDetails") && getLocalstorage("YT-VideoDetails").data
      ? // getLocalstorage("YT-VideoDetails").expire <= new Date()
        getLocalstorage("YT-VideoDetails")
      : { data: [], expire: new Date().setDate(new Date().getDate() + 7) };

  const comparer = (otherArray) => {
    return function (current) {
      return (
        otherArray.filter(function (other) {
          return other.id === current.contentDetails.upload.videoId;
        }).length === 0
      );
    };
  };

  const noVideoDetails =
    detailsCached && detailsCached.data.length >= 1
      ? videosArray.filter(comparer(detailsCached.data))
      : videosArray;

  const noVideoDetailsIDS = noVideoDetails.map((video) => video.contentDetails.upload.videoId);

  const newVideosDetails = noVideoDetails
    ? await axios
        .get(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${noVideoDetailsIDS}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        )
        .then((res) => {
          console.log(
            `Fetched VideoDeails for {${res.data.items.length}} videos..`,
            res.data.items
          );

          const aLLDetails = {
            data: detailsCached.data.concat(res.data.items),
            expire: detailsCached.expire,
          };
          localStorage.setItem("YT-VideoDetails", JSON.stringify(aLLDetails));

          return aLLDetails;
        })
    : detailsCached.data;

  const allVideos = videosArray.map((video) => {
    video.duration = moment
      .duration(
        newVideosDetails.data.find((detail) => detail.id === video.contentDetails.upload.videoId)
          .contentDetails.duration
      )
      .format("hh:mm:ss");
    return video;
  });

  return allVideos;
};
