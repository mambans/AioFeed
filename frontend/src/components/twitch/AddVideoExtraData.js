import fetchProfileImages from './fetchProfileImages';
import fetchGameName from './fetchGameName';

/**
 * Fetch and add following data to stream objects.
 * - profile_image_url
 * - game name
 * - game_img
 * @param {Object} items - Object of Streams/Videos/Clips. (With items.data[] )
 * @param {Boolean} [fetchGameInfo=true] - If it should fetch/add game info
 * @param {Boolean} [fetchProfiles=true] - If it should fetch/add profile image
 * @param {Boolean} [forceNewProfiles=false] - If it should fetch NEW (bypass cache) profile image
 * @async
 * @returns
 */
export default async ({
  items,
  fetchGameInfo = true,
  fetchProfiles = true,
  forceNewProfiles = false,
  saveNewProfiles,
  previousStreams,
}) => {
  const originalArray = items;
  const Profiles = fetchProfiles
    ? await fetchProfileImages({
        items,
        forceNewProfiles,
        previousStreams,
        saveNewProfiles,
      }).catch((e) => [])
    : [];
  const GameInfo = fetchGameInfo ? await fetchGameName({ items }) : [];

  const finallData = originalArray?.data?.map((dataItem) => {
    const foundGameInfo = GameInfo?.find(
      (item) =>
        (item.user_id || item.broadcaster_id) === (dataItem.user_id || dataItem.broadcaster_id)
    );
    const foundProfile = Profiles?.find(
      (item) =>
        (item.user_id || item.broadcaster_id) === (dataItem.user_id || dataItem.broadcaster_id)
    );

    return {
      ...foundGameInfo,
      ...foundProfile,
      ...dataItem,
    };
  });

  return { ...originalArray, data: finallData };
};
