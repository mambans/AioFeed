import { RemoveCookie } from "../../../util/Utils";

export default (setMainState) => {
  RemoveCookie("AioFeed_AccountName");
  RemoveCookie("AioFeed_AccountEmail");
  RemoveCookie("AioFeed_AccountProfileImg");
  RemoveCookie("AioFeed_AuthKey");

  RemoveCookie("Twitter-Listname");

  RemoveCookie("Twitch-access_token");
  RemoveCookie("Twitch-refresh_token");
  RemoveCookie("Twitch-userId");
  RemoveCookie("Twitch-username");
  RemoveCookie("Twitch-profileImg");
  RemoveCookie("TwitchVods_FeedEnabled");
  RemoveCookie("Twitch_FeedEnabled");
  RemoveCookie("Twitch-myState");

  RemoveCookie("Youtube-access_token");
  RemoveCookie("YoutubeUsername");
  RemoveCookie("YoutubeProfileImg");
  RemoveCookie("Youtube_FeedEnabled");

  setMainState();
};
