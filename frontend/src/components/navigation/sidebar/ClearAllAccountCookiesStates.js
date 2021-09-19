import { RemoveCookie } from '../../../util';

const clearAllAccountCookiesStates = ({
  setUsername = () => RemoveCookie('AioFeed_AccountName'),
  setProfileImage = () => RemoveCookie('AioFeed_AccountProfileImg'),
  setEmail = () => RemoveCookie('AioFeed_AccountEmail'),
  setAuthKey = () => RemoveCookie('AioFeed_AuthKey'),
  setRenderModal = () => {},
}) => {
  RemoveCookie('Twitch-access_token');
  RemoveCookie('Twitch-refresh_token');
  RemoveCookie('Twitch-userId');
  RemoveCookie('Twitch-username');
  RemoveCookie('Twitch-profileImg');
  RemoveCookie('Twitch-myState');

  localStorage.removeItem('TwitchVods-Channels');

  localStorage.removeItem('Twitter-Lists');

  RemoveCookie('Youtube-access_token');
  RemoveCookie('YoutubeUsername');
  RemoveCookie('YoutubeProfileImg');

  localStorage.removeItem('Unseen-notifications');
  localStorage.removeItem('YT-followedChannels');
  localStorage.removeItem('activeTheme');
  localStorage.removeItem('CustomFilters');
  localStorage.removeItem('Vods');
  localStorage.removeItem('FavoritesLists');
  localStorage.removeItem('TwitchChatState');
  localStorage.removeItem('Cached_SavedYoutubeVideos');
  localStorage.removeItem('notifications');
  localStorage.removeItem('Feed-size');
  localStorage.removeItem('ChannelsUpdateNotifs');

  setUsername();
  setProfileImage();
  setEmail();
  setAuthKey();
  setRenderModal('login');
};

export default clearAllAccountCookiesStates;
