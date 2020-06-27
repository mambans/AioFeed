import GetCachedProfiles from './GetCachedProfiles';
import API from './API';

/**
 * @param {Object} items - Object of Streams/Videos/Clips. (With items.data[] )
 * @param {Boolean} [forceNewProfiles] - If it should fetch NEW (bypass cache) profile image
 * @async
 * @returns
 */
export default async ({ items, forceNewProfiles, previousStreams }) => {
  const originalArray = items;
  const TwitchProfiles = GetCachedProfiles();
  const noCachedProfileArrayObject = await originalArray.data.filter((user) => {
    return (
      !Object.keys(TwitchProfiles).some((id) => id === (user?.user_id || user?.broadcaster_id)) ||
      !previousStreams?.find((stream) => user?.user_id === stream?.user_id)
    );
  });

  const noCachedProfileArrayIds = Object.values(
    forceNewProfiles ? originalArray.data : noCachedProfileArrayObject
  ).map((user) => {
    return user?.user_id || user?.broadcaster_id;
  });

  const newProfileImgUrls =
    noCachedProfileArrayIds.length > 0
      ? await API.getUser({
          params: {
            id: noCachedProfileArrayIds,
          },
        }).catch((e) => {
          console.error('newProfileImgUrls: ', e);
        })
      : null;

  const finallData = originalArray.data.map((user) => {
    const foundProfile = newProfileImgUrls?.data.data.find(
      (p_user) => p_user.id === (user.user_id || user.broadcaster_id)
    );
    if (foundProfile) {
      user.profile_img_url = foundProfile
        ? foundProfile.profile_image_url
        : TwitchProfiles[user.user_id || user.broadcaster_id] ||
          `${process.env.PUBLIC_URL}/images/placeholder.webp`;
    } else {
      user.profile_img_url =
        TwitchProfiles[user.user_id || user.broadcaster_id] ||
        `${process.env.PUBLIC_URL}/images/placeholder.webp`;
    }
    return user;
  });

  const newProfiles = finallData.reduce(
    // eslint-disable-next-line no-sequences
    (obj, item) => ((obj[item.user_id || item.broadcaster_id] = item.profile_img_url), obj),
    {}
  );
  const FinallTwitchProfilesObj = { ...TwitchProfiles, ...newProfiles };
  localStorage.setItem('TwitchProfiles', JSON.stringify(FinallTwitchProfilesObj));

  return finallData;
};
