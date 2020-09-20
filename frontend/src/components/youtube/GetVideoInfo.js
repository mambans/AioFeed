import axios from 'axios';
import moment from 'moment';
import { getLocalstorage, getCookie } from '../../util/Utils';

function chunk(array, size) {
  const chunked_arr = [];
  let index = 0;
  while (index < array.length) {
    chunked_arr.push(array.slice(index, size + index));
    index += size;
  }
  return chunked_arr;
}

export default async (flattedVideosArray) => {
  const videosArray = [...flattedVideosArray];
  const detailsCached =
    getLocalstorage('YT-VideoDetails') &&
    getLocalstorage('YT-VideoDetails').data &&
    getLocalstorage('YT-VideoDetails').expire >= Date.now()
      ? getLocalstorage('YT-VideoDetails')
      : { data: [], expire: Date.now() + 7 * 24 * 60 * 60 * 1000 };

  const comparer = (otherArray) => {
    return function (current) {
      return (
        otherArray.filter(function (other) {
          return other?.id === current.contentDetails.upload.videoId;
        }).length === 0
      );
    };
  };

  const videosWithNoExtraDetails =
    detailsCached && detailsCached.data.length >= 1
      ? videosArray.filter(comparer(detailsCached.data))
      : videosArray;

  const noVideoDetailsIDS = videosWithNoExtraDetails.map(
    (video) => video.contentDetails.upload.videoId
  );

  const newVideosDetails =
    videosWithNoExtraDetails &&
    videosWithNoExtraDetails.length >= 1 &&
    noVideoDetailsIDS &&
    noVideoDetailsIDS.length >= 1
      ? await Promise.all(
          chunk(noVideoDetailsIDS, 50).map(async (chunk) => {
            return await axios
              .get(
                `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${chunk}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
                {
                  headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getCookie('Youtube-access_token')}`,
                  },
                }
              )
              .then((res) => res.data.items)
              .catch((e) => {
                return null;
              });
          })
        ).then((res) => {
          const flattenArray = res.flat(1);

          const aLLDetails = {
            data: [...detailsCached.data, ...flattenArray],
            expire: detailsCached.expire,
          };

          localStorage.setItem('YT-VideoDetails', JSON.stringify(aLLDetails));

          return aLLDetails;
        })
      : detailsCached;

  const allVideos = videosArray.map((video) => {
    video.duration = newVideosDetails
      ? moment
          .duration(
            newVideosDetails.data.find(
              (detail) => detail?.id === video?.contentDetails.upload.videoId
            )?.contentDetails.duration
          )
          .format('hh:mm:ss')
      : '';
    return video;
  });

  return allVideos;
};
