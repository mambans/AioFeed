export default () => {
  const profiles = JSON.parse(localStorage.getItem("TwitchProfiles")) || {};

  if (!profiles.expireDate || new Date(profiles.expireDate).getTime() < new Date().getTime()) {
    return {
      expireDate: new Date(new Date().setTime(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)),
    };
  } else {
    return profiles;
  }
};
  