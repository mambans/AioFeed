import { getLocalstorage } from '../../util';

const getCachedProfiles = () => {
  const profiles = getLocalstorage('TwitchProfiles') || {};

  if (!profiles.expireDate || new Date(profiles.expireDate).getTime() < Date.now()) {
    return {
      expireDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    };
  }

  return profiles;
};
export default getCachedProfiles;
