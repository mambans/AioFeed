import { RemoveCookie } from '../../../utilities';

const clearAllAccountCookiesStates = ({
  setTwitchAccessToken = () => RemoveCookie('Twitch-access_token'),
  setTwitchRefreshToken = () => RemoveCookie('Twitch-refresh_token'),
  setTwitchUserId = () => RemoveCookie('Twitch-userId'),
  setTwitchUsername = () => RemoveCookie('Twitch-username'),
  setTwitchProfileImage = () => RemoveCookie('Twitch-profileImg'),

  setYoutubeAccessToken = () => RemoveCookie('Youtube-access_token'),
  setYoutubeUsername = () => RemoveCookie('YoutubeUsername'),
  setYoutubeProfileImage = () => RemoveCookie('YoutubeProfileImg'),
}) => {
  RemoveCookie('Twitch-myState');
  localStorage.removeItem('TwitchVods-Channels');
  localStorage.removeItem('TwitchVods');
  localStorage.removeItem('Twitter-Lists');

  localStorage.removeItem('YT-followedChannels');
  localStorage.removeItem('Vods');
  localStorage.removeItem('MyLists');
  localStorage.removeItem('Cached_SavedYoutubeVideos');
  localStorage.removeItem('notifications');
  localStorage.removeItem('notificationsUnreadCount');
  localStorage.removeItem('Feed-size');
  localStorage.removeItem('ChannelsUpdateNotifs');

  setTimeout(() => {
    setTwitchAccessToken();
    setTwitchRefreshToken();
    setTwitchUserId();
    setTwitchUsername();
    setTwitchProfileImage();
    setYoutubeAccessToken();
    setYoutubeUsername();
    setYoutubeProfileImage();
  }, 500);
};

export default clearAllAccountCookiesStates;
