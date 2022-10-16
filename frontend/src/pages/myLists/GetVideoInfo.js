import { getLocalstorage, chunk, setLocalStorage } from '../../util';
import YoutubeAPI from '../youtube/API';
// import YoutubeAPI from '../youtube/API';

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

  console.log('unCachedFullyVideos:', unCachedFullyVideos);
  if (!Boolean(unCachedFullyVideos?.length)) {
    const cachedVideos = fullyCachedVideos.items.filter((cache) =>
      videosArray.find((video) => video === cache?.contentDetails?.upload?.videoId)
    );

    return cachedVideos;
  }

  const newVideosDetails = await Promise.allSettled(
    chunk(unCachedFullyVideos, 50).map(async (chunk) => {
      return await YoutubeAPI.getVideoInfo({
        part: 'contentDetails,snippet',
        id: chunk.join(','),
      })
        .then((res) => {
          return res.data.items.map((item) => ({
            ...item,
            contentDetails: {
              ...item.contentDetails,
              upload: { videoId: item.id },
            },
          }));
        })
        .catch((e) => {
          return [];
        });
    })
  ).then((res) => res.flat(1));

  if (Boolean(fullyCachedVideos.items.length) && Boolean(newVideosDetails.length)) {
    setLocalStorage('Cached_SavedYoutubeVideos', {
      items: [...fullyCachedVideos.items.slice(-50), ...newVideosDetails],
      expire: fullyCachedVideos.expire,
    });
  }

  return [...(newVideosDetails || []), ...(CachedFullyVideos || [])];
};

export default GetVideoInfo;
