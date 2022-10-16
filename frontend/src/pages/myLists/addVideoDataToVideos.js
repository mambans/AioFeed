import { fetchListVideos } from './List';

const addVideoDataToVideos = async ({ savedVideosWithData, list, videos }) => {
  const { missing, existing } =
    videos?.reduce(
      (acc, id) => {
        const video = savedVideosWithData.find((v) => String(v.id) === String(id) && !v?.loading);
        if (video) {
          return { ...acc, existing: [...acc.existing, video] };
        }
        return { ...acc, missing: [...acc.missing, id] };
      },
      { missing: [], existing: [] }
    ) || {};

  if (missing?.length) {
    const newlyFetchedVideoData = await fetchListVideos({
      list,
      videos: missing,
    });

    const orderAndMergeVideos = videos?.reduce((acc, id) => {
      const video = [...existing, ...newlyFetchedVideoData].find(
        (v) => String(v.id) === String(id) && !v?.loading
      );

      if (video) return [...acc, video];
      return acc;
    }, []);

    return orderAndMergeVideos;
  }
  return existing || [];
};
export default addVideoDataToVideos;
