import fetchProfileImages from './fetchProfileImages';
import fetchGameName from './fetchGameName';

/**
 * Fetch and add following data to stream objects.
 * - profile_img_url
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

  const finallData = originalArray?.data?.map((channel) => {
    const foundGameInfo = GameInfo?.find((item) => item.user_id === channel.user_id);
    const foundProfile = Profiles?.find((item) => item.user_id === channel.user_id);

    return {
      ...channel,
      profile_img_url: foundProfile?.profile_img_url,
      game_name: foundGameInfo?.game_name,
      game_img: foundGameInfo?.game_img,
    };
  });

  return { ...originalArray, data: finallData };
};
