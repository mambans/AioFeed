import { chunk } from '../../../util';
import TwitchAPI from '../API';
import getCachedProfiles from '../GetCachedProfiles';

const addProfileInfo = async ({ save, refresh, items = [] } = {}) => {
  const cached = getCachedProfiles({ refresh });

  const nonCached = items.reduce((acc, i) => {
    if (cached[i.user_id]) return acc;
    return [...acc, i.user_id];
  }, []);

  const nonCachedChunked = chunk(nonCached, 100);

  const newUsers = nonCached?.length
    ? await Promise.all(
        nonCachedChunked.map(async (array) => {
          return await TwitchAPI.getUser({ id: array })
            .then((res) => res?.data?.data)
            .catch(() => []);
        })
      ).then((res) => res.flat())
    : [];

  const newCache = {
    ...cached,
    ...newUsers.reduce((acc, i) => {
      acc[i.id] = { profile_image: i.profile_image_url, login: i.login };

      return acc;
    }, {}),
    expireDate: cached?.expireDate,
  };

  if (save) localStorage.setItem('TwitchProfiles', JSON.stringify(newCache));

  const newItemsWithProfile = items.map((i) => {
    if (!i.profile_image_url && newCache[i.user_id]) {
      i.profile_image_url = newCache[i.user_id]?.profile_image;
      if (newCache[i.user_id]?.login) i.login = newCache[i.user_id]?.login;
    }

    return i;
  });

  return newItemsWithProfile;
};

export default addProfileInfo;
