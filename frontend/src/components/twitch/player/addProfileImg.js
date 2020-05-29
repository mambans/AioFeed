import GetCachedProfiles from "../GetCachedProfiles";
import API from "../API";

export default async ({ user_id, currentStreamObj }) => {
  if (!currentStreamObj || !currentStreamObj.profile_img_url) {
    const TwitchProfiles = GetCachedProfiles();

    const profile =
      TwitchProfiles[user_id] ||
      (await API.getUser({
        params: {
          id: user_id,
        },
      }).then((res) => res.data.data[0].profile_image_url));

    if (!TwitchProfiles[user_id]) {
      localStorage.setItem(
        "TwitchProfiles",
        JSON.stringify({ ...TwitchProfiles, [user_id]: profile })
      );
    }
    return { ...currentStreamObj, profile_img_url: profile };
  }
  return currentStreamObj;
};
