import { RemoveCookie } from '../../../util/Utils';

export default (setMainState) => {
  RemoveCookie('AioFeed_AccountName');
  RemoveCookie('AioFeed_AccountEmail');
  RemoveCookie('AioFeed_AccountProfileImg');
  RemoveCookie('AioFeed_AuthKey');

  RemoveCookie('Twitch-access_token');
  RemoveCookie('Twitch-refresh_token');
  RemoveCookie('Twitch-userId');
  RemoveCookie('Twitch-username');
  RemoveCookie('Twitch-profileImg');
  RemoveCookie('Twitch-myState');
  localStorage.removeItem('Twitch-ChannelsUpdateNotifs');

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

  setMainState();
};
