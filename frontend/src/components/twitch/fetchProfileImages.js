import GetCachedProfiles from './GetCachedProfiles';
import TwitchAPI from './API';
import { chunk } from '../../util/Utils';

/**
 * @param {Object} items - Object of Streams/Videos/Clips. (With items.data[] )
 * @param {Boolean} [forceNewProfiles] - If it should fetch NEW (bypass cache) profile image
 * @async
 * @returns
 */
const fetchProfileImages = async ({
  items,
  forceNewProfiles,
  previousStreams,
  saveNewProfiles = true,
}) => {
  const originalArray = items;
  const TwitchProfiles = GetCachedProfiles();
  const noCachedProfileArrayObject = await originalArray?.data?.filter(
    (user) =>
      !Object.keys(TwitchProfiles).some((id) => id === (user?.user_id || user?.broadcaster_id)) ||
      (previousStreams && !previousStreams?.find((stream) => user?.user_id === stream?.user_id))
  );

  const noCachedProfileArrayIds =
    (originalArray?.data || noCachedProfileArrayObject) &&
    Object.values(forceNewProfiles ? originalArray?.data : noCachedProfileArrayObject).map(
      (user) => user?.user_id || user?.broadcaster_id
    );

  const chunkedNoCachedProfileArrayIds =
    noCachedProfileArrayIds?.length > 0 ? chunk(noCachedProfileArrayIds, 100) : null;

  const newProfileImgUrls =
    chunkedNoCachedProfileArrayIds &&
    (await Promise.all(
      chunkedNoCachedProfileArrayIds.map(async (channelsChunk) => {
        return (
          channelsChunk?.length >= 1 &&
          (await TwitchAPI.getUser({
            id: channelsChunk,
          })
            .then((res) => res.data.data)
            .catch((e) => console.error('newProfileImgUrls: ', e)))
        );
      })
    ).then((res) => res.flat(1)));

  const finallData = await originalArray?.data?.map((user) => {
    const foundProfile = newProfileImgUrls?.find(
      (p_user) => p_user?.id === (user?.user_id || user?.broadcaster_id)
    );

    return {
      ...user,
      ...foundProfile,
      profile_image_url:
        foundProfile?.profile_image_url ||
        TwitchProfiles[user?.user_id || user?.broadcaster_id]?.profile_image ||
        `${process.env.PUBLIC_URL}/images/webp/placeholder.webp`,
      login: foundProfile?.login || TwitchProfiles[user?.user_id || user?.broadcaster_id]?.login,
    };
  });

  const finallDataRemovedPlaceholderObjs = finallData
    .reduce((acc, current) => {
      const x = acc.find((item) => item.user_id === current.user_id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [])
    .filter(
      (item) => item.profile_image_url !== `${process.env.PUBLIC_URL}/images/webp/placeholder.webp`
    );

  const newProfiles = finallDataRemovedPlaceholderObjs.reduce(
    (obj, item) => (
      (obj[item?.user_id || item?.broadcaster_id] = {
        profile_image: item?.profile_image_url,
        login: item?.login,
        // eslint-disable-next-line no-sequences
      }),
      obj
    ),
    {}
  );

  if (saveNewProfiles) {
    const FinallTwitchProfilesObj = { ...TwitchProfiles, ...newProfiles };
    localStorage.setItem('TwitchProfiles', JSON.stringify(FinallTwitchProfilesObj));
  }

  return finallData;
};
export default fetchProfileImages;
