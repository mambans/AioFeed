import { getLocalstorage } from "../../util/Utils";

export default (forceNewProfiles) => {
  const profiles = forceNewProfiles ? {} : getLocalstorage("TwitchProfiles") || {};

  if (!profiles.expireDate || new Date(profiles.expireDate).getTime() < Date.now()) {
    return {
      expireDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    };
  } else {
    return profiles;
  }
};
