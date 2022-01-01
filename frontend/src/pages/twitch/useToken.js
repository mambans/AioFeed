import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import useCookieState from '../../hooks/useCookieState';
import useLocalStorageState from '../../hooks/useLocalStorageState';
import useSyncedLocalState from '../../hooks/useSyncedLocalState';
import { askForBrowserNotificationPermission, getLocalstorage } from '../../util';
import AccountContext from '../account/AccountContext';
import API from '../navigation/API';
import validateToken from './validateToken';

const TTL = 100000;

export const TwitchContext = React.createContext();

export const TwitchProvider = ({ children }) => {
  const { authKey } = useContext(AccountContext);
  const [pref, setPref] = useLocalStorageState('TwitchPreferences', {}) || {};
  const [twitchAccessToken, setTwitchAccessToken] = useCookieState('Twitch-access_token');
  const [twitchRefreshToken, setTwitchRefreshToken] = useCookieState('Twitch-refresh_token');
  const [twitchUserId, setTwitchUserId] = useCookieState('Twitch-userId');
  const [twitchUsername, setTwitchUsername] = useCookieState('Twitch-username');
  const [twitchProfileImage, setTwitchProfileImage] = useCookieState('Twitch-profileImg');
  const [updateNotischannels, setUpdateNotischannels] = useSyncedLocalState(
    'ChannelsUpdateNotifs',
    []
  );
  const [favStreams, setFavStreams] = useSyncedLocalState('FavoriteStreams', []);
  const invoked = useRef(false);

  const toggle = (i, v) => setPref((c) => ({ ...c, [i]: v || !c[i] }));
  const fetchTwitchContextData = useCallback(async () => {
    const {
      access_token,
      channel_update_notis,
      favorite_streams,
      refresh_token,
      user: { Id, Profile, Username } = {},
    } = await API.getTwitchData()
      .then((res) => res?.data?.Item || {})
      .catch((e) => {
        console.error('Twitch usetoken useEffect error: ', e);
        toast.error(e.message);
        return {};
      });

    setTwitchAccessToken(access_token);
    setTwitchRefreshToken(refresh_token);
    setTwitchUserId(Id);
    setTwitchUsername(Username);
    setTwitchProfileImage(Profile);

    invoked.current = true;
    setFavStreams((favorite_streams || getLocalstorage('FavoriteStreams') || []).filter((i) => i));
    setUpdateNotischannels(
      (channel_update_notis || getLocalstorage('ChannelsUpdateNotifs') || []).filter((i) => i)
    );
  }, [
    setTwitchAccessToken,
    setTwitchRefreshToken,
    setTwitchUserId,
    setTwitchUsername,
    setTwitchProfileImage,
    setFavStreams,
    setUpdateNotischannels,
  ]);

  useEffect(() => {
    if (twitchAccessToken && authKey && !invoked.current) fetchTwitchContextData();
  }, [fetchTwitchContextData, twitchAccessToken, authKey]);

  const promise = useRef();

  const validationOfToken = useCallback(() => {
    if (!promise.current?.promise || Date.now() > promise.current?.ttl) {
      promise.current = { promise: validateToken(), ttl: Date.now() + TTL };
    }
    return promise.current.promise;
  }, []);

  return (
    <TwitchContext.Provider
      value={{
        validationOfToken,
        autoRefreshEnabled: Boolean(pref.auto_refresh),
        setAutoRefreshEnabled: () => toggle('auto_refresh'),
        twitchVideoHoverEnable: Boolean(pref.video_hover),
        setTwitchVideoHoverEnable: () => toggle('video_hover'),
        isEnabledOfflineNotifications: Boolean(pref.offline_notis),
        setIsEnabledOfflineNotifications: () => {
          askForBrowserNotificationPermission();
          toggle('offline_notis');
        },
        isEnabledUpdateNotifications: Boolean(pref.update_notis),
        setIsEnabledUpdateNotifications: () => {
          askForBrowserNotificationPermission();
          toggle('update_notis');
        },
        setEnableVodVolumeOverlay: () => toggle('vod_volume_overlay'),
        enableVodVolumeOverlay: Boolean(pref.vod_volume_overlay),
        twitchAccessToken,
        setTwitchAccessToken,
        twitchRefreshToken,
        setTwitchRefreshToken,
        twitchUserId,
        setTwitchUserId,
        twitchUsername,
        setTwitchUsername,
        twitchProfileImage,
        setTwitchProfileImage,
        updateNotischannels,
        setUpdateNotischannels,
        favStreams,
        setFavStreams,
        fetchTwitchContextData,
      }}
    >
      {children}
    </TwitchContext.Provider>
  );
};

const useToken = () => {
  const { validationOfToken } = useContext(TwitchContext);

  return useCallback(async () => {
    const validPromise = await validationOfToken();
    return Promise.resolve(validPromise);
  }, [validationOfToken]);
};
export default useToken;
