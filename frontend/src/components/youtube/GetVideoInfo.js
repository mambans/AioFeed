import axios from 'axios';
import { getLocalstorage, getCookie, chunk } from '../../util/Utils';
import { merge } from 'lodash';

const getVideoInfo = async ({ videos }) => {
  const videosArray = [...videos];

  const fullyCachedVideos =
    getLocalstorage('Cached_SavedYoutubeVideos')?.items &&
    getLocalstorage('Cached_SavedYoutubeVideos')?.expire >= Date.now()
      ? getLocalstorage('Cached_SavedYoutubeVideos')
      : {
          items: getLocalstorage('Cached_SavedYoutubeVideos')?.items?.reverse()?.slice(0, 50) || [],
          expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };

  const CachedFullyVideos = videosArray.filter((video) =>
    fullyCachedVideos.items.find(
      (cache) => cache?.contentDetails?.upload?.videoId === video?.contentDetails?.upload?.videoId
    )
  );

  const unCachedFullyVideos =
    videosArray.filter(
      (video) =>
        !fullyCachedVideos.items.find(
          (cache) =>
            cache?.contentDetails?.upload?.videoId === video?.contentDetails?.upload?.videoId
        )
    ) || [];

  if (!Boolean(unCachedFullyVideos?.length)) {
    const cachedVideos = fullyCachedVideos.items.filter((cache) =>
      videosArray.find(
        (video) => video?.contentDetails?.upload?.videoId === cache?.contentDetails?.upload?.videoId
      )
    );

    return cachedVideos;
  }

  const noVideoDetailsIDS = unCachedFullyVideos.map(
    (video) => video?.contentDetails?.upload?.videoId
  );

  const newVideosDetails = Boolean(noVideoDetailsIDS?.length)
    ? await Promise.all(
        chunk(noVideoDetailsIDS, 50).map(
          async (chunk) =>
            await axios
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
              .catch((e) => null)
        )
      ).then((res) => res.flat(1))
    : CachedFullyVideos;

  const newVideosWithDetails =
    unCachedFullyVideos?.map((video) => {
      const newFoundDetails = newVideosDetails?.find(
        (newDetails) => newDetails.id === video?.contentDetails?.upload?.videoId
      );
      return merge(video, newFoundDetails);
    }) || [];

  try {
    localStorage.setItem(
      'Cached_SavedYoutubeVideos',
      JSON.stringify({
        items: [...(fullyCachedVideos.items.slice(-50) || []), ...(newVideosWithDetails || [])],
        expire: fullyCachedVideos.expire,
      })
    );
  } catch (e) {
    console.log('Cached_SavedYoutubeVideos localStorage.setItem error:', error);
  }

  return [...(CachedFullyVideos || []), ...(newVideosWithDetails || [])];
};

export default getVideoInfo;
