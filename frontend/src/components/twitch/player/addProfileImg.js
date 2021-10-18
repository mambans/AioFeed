import GetCachedProfiles from '../GetCachedProfiles';
import TwitchAPI from '../API';
import { setLocalStorage } from '../../../util';

const addProfileImg = async ({ user_id, currentStreamObj, save = true }) => {
  if (!currentStreamObj?.profile_image_url || !currentStreamObj?.login) {
    const TwitchProfiles = GetCachedProfiles();
    // const TwitchProfiles = {};

    const profile =
      TwitchProfiles[user_id]?.profile_image_url && TwitchProfiles[user_id]?.login
        ? TwitchProfiles[user_id]
        : await TwitchAPI.getUser({
            id: user_id,
          }).then((res) => ({
            profile_image: res.data.data[0].profile_image_url,
            login: res.data.data[0].login,
          }));

    if (!TwitchProfiles[user_id]) {
      try {
        if (save) {
          setTimeout(() => {
            setLocalStorage('TwitchProfiles', {
              ...Object.fromEntries(Object.entries(TwitchProfiles).slice(0, 100)),
              [user_id]: { profile_image: profile.profile_image, login: profile.login },
            });
          }, 60 * 20);
        }
      } catch (error) {
        console.log('TwitchProfiles localStorage.setItem error:', error);
      }
    }

    return {
      ...currentStreamObj,
      profile_image_url: profile?.profile_image,
      login: profile?.login,
    };
  }
  return currentStreamObj;
};
export default addProfileImg;
