import { fetchListVideos } from './List';

const addVideoDataToVideos = async ({
  savedVideosWithData,
  list,
  videos,
  ytExistsAndValidated,
  twitchExistsAndValidated,
}) => {
  const filteredVideos = videos?.reduce(
    (acc, id) => {
      const video = savedVideosWithData.find((v) => String(v.id) === String(id) && !v?.loading);
      if (video) {
        return { ...acc, existing: [...acc.existing, video] };
      }
      return { ...acc, missing: [...acc.missing, id] };
    },
    { missing: [], existing: [] }
  );

  if (filteredVideos?.missing?.length) {
    const newlyFetchedVideoData = await fetchListVideos({
      list,
      ytExistsAndValidated,
      twitchExistsAndValidated,
      videos: filteredVideos.missing,
    });

    const orderAndMergeVideos = videos?.reduce((acc, id) => {
      const video = [...filteredVideos.existing, ...newlyFetchedVideoData].find(
        (v) => String(v.id) === String(id) && !v?.loading
      );

      if (video) return [...acc, video];
      return acc;
    }, []);

    return orderAndMergeVideos;
  }
  return filteredVideos?.existing || [];
};
export default addVideoDataToVideos;
