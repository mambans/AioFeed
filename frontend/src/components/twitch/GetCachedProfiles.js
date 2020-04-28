import { getLocalstorage } from "../../util/Utils";

export default () => {
  const profiles = getLocalstorage("TwitchProfiles") || {};

  if (!profiles.expireDate || new Date(profiles.expireDate).getTime() < new Date().getTime()) {
    return {
      expireDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    };
  } else {
    return profiles;
  }
};
