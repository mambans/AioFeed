import Util from "../../util/Util";

export default () => {
  const profiles = Util.getLocalstorage("TwitchProfiles") || {};

  if (!profiles.expireDate || new Date(profiles.expireDate).getTime() < new Date().getTime()) {
    return {
      expireDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    };
  } else {
    return profiles;
  }
};
