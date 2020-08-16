import GetCachedProfiles from '../GetCachedProfiles';
import API from '../API';

export default async ({ user_id, currentStreamObj }) => {
  if (!currentStreamObj?.profile_image_url || !currentStreamObj?.login) {
    const TwitchProfiles = GetCachedProfiles();

    const profile =
      TwitchProfiles[user_id]?.profile_image_url && TwitchProfiles[user_id]?.login
        ? TwitchProfiles[user_id]
        : await API.getUser({
            params: {
              id: user_id,
            },
          }).then((res) => {
            return {
              profile_image: res.data.data[0].profile_image_url,
              login: res.data.data[0].login,
            };
          });

    if (!TwitchProfiles[user_id]) {
      localStorage.setItem(
        'TwitchProfiles',
        JSON.stringify({
          ...TwitchProfiles,
          [user_id]: { profile_image: profile.profile_image, login: profile.login },
        })
      );
    }

    return { ...currentStreamObj, profile_image_url: profile.profile_image, login: profile.login };
  }
  return currentStreamObj;
};
