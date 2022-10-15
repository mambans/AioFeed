import { getLocalstorage, chunk, setLocalStorage } from '../../util';
import merge from 'lodash/merge';
import YoutubeAPI from './API';

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
            await YoutubeAPI.getVideoInfo({ part: 'contentDetails', id: chunk })
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

  setLocalStorage('Cached_SavedYoutubeVideos', {
    items: [...(fullyCachedVideos.items.slice(-50) || []), ...(newVideosWithDetails || [])],
    expire: fullyCachedVideos.expire,
  });

  return [...(CachedFullyVideos || []), ...(newVideosWithDetails || [])];
};

export default getVideoInfo;
