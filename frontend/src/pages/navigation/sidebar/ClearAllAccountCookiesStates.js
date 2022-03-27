import { RemoveCookie } from '../../../util';

const clearAllAccountCookiesStates = ({
  setUsername = () => RemoveCookie('AioFeed_AccountName'),
  setAuthKey = () => RemoveCookie('AioFeed_AuthKey'),

  setTwitchAccessToken = () => RemoveCookie('Twitch-access_token'),
  setTwitchRefreshToken = () => RemoveCookie('Twitch-refresh_token'),
  setTwitchUserId = () => RemoveCookie('Twitch-userId'),
  setTwitchUsername = () => RemoveCookie('Twitch-username'),
  setTwitchProfileImage = () => RemoveCookie('Twitch-profileImg'),

  setYoutubeAccessToken = () => RemoveCookie('Youtube-access_token'),
  setYoutubeUsername = () => RemoveCookie('YoutubeUsername'),
  setYoutubeProfileImage = () => RemoveCookie('YoutubeProfileImg'),

  setRenderModal = () => {},
}) => {
  RemoveCookie('Twitch-myState');
  localStorage.removeItem('TwitchVods-Channels');
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

    setUsername();
    setAuthKey();
    setRenderModal('login');
  }, 500);
};

export default clearAllAccountCookiesStates;
