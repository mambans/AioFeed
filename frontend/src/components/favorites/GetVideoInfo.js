import axios from 'axios';
import { getLocalstorage, getCookie, chunk } from '../../util/Utils';

const GetVideoInfo = async ({ videos = [] }) => {
  const videosArray = [...videos];

  const fullyCachedVideos =
    getLocalstorage('Cached_SavedYoutubeVideos')?.items &&
    getLocalstorage('Cached_SavedYoutubeVideos')?.expire >= Date.now()
      ? getLocalstorage('Cached_SavedYoutubeVideos')
      : { items: [], expire: Date.now() + 7 * 24 * 60 * 60 * 1000 };

  const CachedFullyVideos = fullyCachedVideos.items.filter((video) =>
    videosArray.includes(video?.contentDetails?.upload?.videoId)
  );

  const unCachedFullyVideos =
    videosArray.filter(
      (video) =>
        !fullyCachedVideos.items.find((cache) => cache?.contentDetails?.upload?.videoId === video)
    ) || [];

  if (!Boolean(unCachedFullyVideos?.length)) {
    const cachedVideos = fullyCachedVideos.items.filter((cache) =>
      videosArray.find((video) => video === cache?.contentDetails?.upload?.videoId)
    );

    return cachedVideos;
  }

  const newVideosDetails = Boolean(unCachedFullyVideos?.length)
    ? await Promise.all(
        chunk(unCachedFullyVideos, 50).map(
          async (chunk) =>
            await axios
              .get(
                `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${chunk}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
                {
                  headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${getCookie('Youtube-access_token')}`,
                  },
                }
              )
              .then((res) =>
                res.data.items.map((item) => ({
                  ...item,
                  contentDetails: {
                    ...item.contentDetails,
                    upload: { videoId: item.id },
                  },
                }))
              )
              .catch((e) => null)
        )
      ).then((res) => res.flat(1))
    : CachedFullyVideos;

  if (Boolean(fullyCachedVideos.items.length) && Boolean(newVideosDetails.length)) {
    localStorage.setItem(
      'Cached_SavedYoutubeVideos',
      JSON.stringify({
        items: [...fullyCachedVideos.items.slice(-50), ...newVideosDetails],
        expire: fullyCachedVideos.expire,
      })
    );
  }

  return [...(newVideosDetails || []), ...(CachedFullyVideos || [])];
};

export default GetVideoInfo;
