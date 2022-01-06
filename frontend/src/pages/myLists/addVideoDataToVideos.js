import { fetchListVideos } from './List';

const addVideoDataToVideos = async ({
  savedVideosWithData,
  list,
  ytExistsAndValidated,
  twitchExistsAndValidated,
}) => {
  console.log('savedVideosWithData:', savedVideosWithData);
  console.log('list:', list);
  console.log('ytExistsAndValidated:', ytExistsAndValidated);
  console.log('twitchExistsAndValidated:', twitchExistsAndValidated);
  const filteredVideos = list?.videos.reduce(
    (acc, id) => {
      const video = savedVideosWithData.find((v) => String(v.id) === String(id) && !v?.loading);
      if (video) {
        return { ...acc, existing: [...acc.existing, video] };
      }
      return { ...acc, missing: [...acc.missing, id] };
    },
    { missing: [], existing: [] }
  );

  console.log('filteredVideos:', filteredVideos);
  if (filteredVideos?.missing?.length) {
    const newlyFetchedVideoData = await fetchListVideos({
      list,
      ytExistsAndValidated,
      twitchExistsAndValidated,
      videos: filteredVideos.missing,
    });
    console.log('newlyFetchedVideoData:', newlyFetchedVideoData);

    const orderAndMergeVideos = list?.videos.reduce((acc, id) => {
      const video = [...filteredVideos.existing, ...newlyFetchedVideoData].find(
        (v) => String(v.id) === String(id) && !v?.loading
      );

      if (video) return [...acc, video];
      return acc;
    }, []);
    console.log('orderAndMergeVideos:', orderAndMergeVideos);

    return orderAndMergeVideos;
  }
  return filteredVideos?.existing || [];
};
export default addVideoDataToVideos;
