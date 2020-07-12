import GetCachedProfiles from './GetCachedProfiles';
import API from './API';

function chunk(array, size) {
  const chunked_arr = [];
  let index = 0;
  while (index < array.length) {
    chunked_arr.push(array.slice(index, size + index));
    index += size;
  }
  return chunked_arr;
}

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
      (previousStreams && !previousStreams?.find((stream) => user?.user_id === stream?.user_id))
    );
  });

  const noCachedProfileArrayIds = Object.values(
    forceNewProfiles ? originalArray.data : noCachedProfileArrayObject
  ).map((user) => {
    return user?.user_id || user?.broadcaster_id;
  });

  const chunkedNoCachedProfileArrayIds =
    noCachedProfileArrayIds?.length > 0 ? chunk(noCachedProfileArrayIds, 100) : null;

  const newProfileImgUrls =
    chunkedNoCachedProfileArrayIds &&
    (await Promise.all(
      chunkedNoCachedProfileArrayIds.map(async (channelsChunk) => {
        return await API.getUser({
          params: {
            id: channelsChunk,
          },
        })
          .then((res) => {
            return res.data.data;
          })
          .catch((e) => {
            console.error('newProfileImgUrls: ', e);
          });
      })
    ).then((res) => {
      return res.flat(1);
    }));

  const finallData = await originalArray.data.map((user) => {
    const foundProfile = newProfileImgUrls?.find(
      (p_user) => p_user.id === (user.user_id || user.broadcaster_id)
    );

    user.profile_img_url =
      foundProfile?.profile_image_url ||
      TwitchProfiles[user.user_id || user.broadcaster_id] ||
      `${process.env.PUBLIC_URL}/images/placeholder.webp`;

    return user;
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
    .filter((item) => item.profile_img_url !== `${process.env.PUBLIC_URL}/images/placeholder.webp`);

  const newProfiles = finallDataRemovedPlaceholderObjs.reduce(
    (obj, item) => (
      // eslint-disable-next-line no-sequences
      (obj[item?.user_id || item?.broadcaster_id] = item?.profile_img_url), obj
    ),
    {}
  );

  const FinallTwitchProfilesObj = { ...TwitchProfiles, ...newProfiles };
  localStorage.setItem('TwitchProfiles', JSON.stringify(FinallTwitchProfilesObj));

  return finallData;
};
