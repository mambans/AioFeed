import React, { useContext, useEffect } from 'react';
import { MdVideocam, MdAutorenew, MdCrop169, MdDynamicFeed } from 'react-icons/md';
import { FaTwitch, FaYoutube, FaTwitter, FaRegWindowRestore } from 'react-icons/fa';
import { FiSidebar } from 'react-icons/fi';
import { TiFlash } from 'react-icons/ti';
import { AiOutlineDisconnect } from 'react-icons/ai';
import { HiViewList } from 'react-icons/hi';

import AccountContext from './../../account/AccountContext';
import FeedsContext from './../../feed/FeedsContext';
import ReAuthenticateButton from './ReAuthenticateButton';
import Themeselector from './../../themes/Themeselector';
import ToggleButton from './ToggleButton';
import UpdateTwitterLists from './UpdateTwitterLists';
import disconnectYoutube from './../../youtube/disconnectYoutube';
import disconnectTwitch from './../../twitch/disconnectTwitch';
import TwitterForms from './TwitterForms';
import {
  StyledLogoutContiner,
  ToggleButtonsContainer,
  ToggleButtonsContainerHeader,
} from './StyledComponents';
import { TwitchContext } from '../../twitch/useToken';
import { YoutubeContext } from '../../youtube/useToken';
import FeedSizeSlider from './FeedSizeSlider';
import AccountDetails from './AccountDetails';
import NavigationContext from '../NavigationContext';
import Settings from './Settings';
import FeedSectionAdd from '../../feedSections';

const SidebarAccount = () => {
  const { username, authKey } = useContext(AccountContext) || {};
  const { setRenderModal } = useContext(NavigationContext);

  const {
    setAutoRefreshEnabled,
    autoRefreshEnabled,
    twitchVideoHoverEnable,
    setTwitchVideoHoverEnable,
    isEnabledOfflineNotifications,
    setIsEnabledOfflineNotifications,
    isEnabledUpdateNotifications,
    setIsEnabledUpdateNotifications,
    setEnableVodVolumeOverlay,
    enableVodVolumeOverlay,
    setTwitchAccessToken,
    twitchAccessToken,
  } = useContext(TwitchContext) || {};
  const {
    youtubeVideoHoverEnable,
    setYoutubeVideoHoverEnable,
    setYoutubeAccessToken,
    youtubeAccessToken,
  } = useContext(YoutubeContext) || {};
  const { showTwitchSidebar, setShowTwitchSidebar, ...feedProps } = useContext(FeedsContext) || {};

  useEffect(() => {
    if (!username || !authKey) setRenderModal('login');
  }, [username, authKey, setRenderModal]);

  const domainColors = {
    Twitch: 'rgb(169, 112, 255)',
    Youtube: 'rgb(255, 0, 0)',
    MyLists: 'var(--listColorAdd)',
    Twitter: 'rgb(29, 161, 242)',
    FeedSections: 'hsl(60, 80%, 50%)',
  };

  const feedsBtns = [
    {
      serviceName: 'Twitch',
      icon: <FaTwitch size={24} color={domainColors.Twitch} />,
      tooltip: twitchAccessToken
        ? (feedProps.enableTwitch ? 'Disable ' : 'Enable ') + ` Twitch feed`
        : `Need to connect/authenticate with a Twitch account first.`,
    },
    {
      serviceName: 'Twitter',
      scrollIntoView: false,
      icon: <FaTwitter size={24} color={domainColors.Twitter} />,
      tooltip: (feedProps.enableTwitter ? 'Disable ' : 'Enable ') + ` Twitter feed`,
      tokenExists: true,
    },
    {
      serviceName: 'Youtube',
      icon: <FaYoutube size={24} color={domainColors.Youtube} />,
      tooltip: youtubeAccessToken
        ? (feedProps.enableYoutube ? 'Disable ' : 'Enable ') + ` Twitch feed`
        : `Need to connect/authenticate with a Youtube account first.`,
    },
    {
      serviceName: 'TwitchVods',
      icon: <MdVideocam size={24} color={domainColors.Twitch} />,
      tooltip: twitchAccessToken
        ? (feedProps.enableTwitchVods ? 'Disable ' : 'Enable ') + ` Twitch feed`
        : `Need to connect/authenticate with a Twitch account first.`,
      tokenExists: twitchAccessToken,
    },
    {
      serviceName: 'MyLists',
      icon: <HiViewList size={24} color={domainColors.MyLists} />,
      tooltip: (feedProps.enableMyLists ? 'Disable ' : 'Enable ') + ` MyLists feed`,
    },
    {
      serviceName: 'FeedSections',
      icon: <MdDynamicFeed size={24} color={domainColors.FeedSections} />,
      tooltip: (feedProps.enableMyLists ? 'Disable ' : 'Enable ') + ` MyLists feed`,
      tokenExists: twitchAccessToken,
    },
  ];

  const settingsButtons = [
    {
      setEnable: setAutoRefreshEnabled,
      enabled: autoRefreshEnabled,
      label: 'Twitch auto-refresh (25s)',
      serviceName: 'Twitch',
      tooltip: twitchAccessToken
        ? (autoRefreshEnabled ? 'Disable ' : 'Enable ') + `Twitch auto refresh`
        : `Need to connect/authenticate with a Twitch account first.`,
      icon: <MdAutorenew size={18} color={domainColors.Twitch} />,
    },
    {
      setEnable: setShowTwitchSidebar,
      enabled: showTwitchSidebar,
      label: 'Twitch sidebar',
      serviceName: 'Twitch',
      tooltip: twitchAccessToken
        ? (showTwitchSidebar ? 'Hide ' : 'Show ') + `Twitch Sidebar`
        : `Need to connect/authenticate with a Twitch account first.`,

      icon: <FiSidebar size={18} color={domainColors.Twitch} />,
    },
    {
      setEnable: setIsEnabledUpdateNotifications,
      enabled: isEnabledUpdateNotifications,
      label: 'Twitch update notifications',
      serviceName: 'Twitch',
      tooltip: twitchAccessToken
        ? (isEnabledUpdateNotifications ? 'Disable ' : 'Enable ') +
          `notifications for when streams title or game changes`
        : `Need to connect/authenticate with a Twitch account first.`,

      icon: <TiFlash size={18} color={domainColors.Twitch} />,
    },
    {
      setEnable: setIsEnabledOfflineNotifications,
      enabled: isEnabledOfflineNotifications,
      label: 'Twitch offline notifications',
      serviceName: 'Twitch',
      tooltip: twitchAccessToken
        ? (isEnabledOfflineNotifications ? 'Disable ' : 'Enable ') +
          `notifications for when streams go offline`
        : `Need to connect/authenticate with a Twitch account first.`,

      icon: <AiOutlineDisconnect size={18} color={domainColors.Twitch} />,
    },
    {
      setEnable: setTwitchVideoHoverEnable,
      enabled: twitchVideoHoverEnable,
      label: 'Twitch hover-video',
      serviceName: 'Twitch',
      tooltip: twitchAccessToken
        ? (twitchVideoHoverEnable ? 'Disable ' : 'Enable ') + `live video preview on hover`
        : `Need to connect/authenticate with a Youtube account first.`,

      icon: <FaRegWindowRestore size={18} />,
      smallerIcons: <FaTwitch size={14} color={domainColors.Twitch} />,
    },
    {
      setEnable: setYoutubeVideoHoverEnable,
      enabled: youtubeVideoHoverEnable,
      label: 'Youtube hover-video',
      serviceName: 'Youtube',
      tooltip: youtubeAccessToken
        ? (youtubeVideoHoverEnable ? 'Disable ' : 'Enable ') + `video on hover`
        : `Need to connect/authenticate with a Youtube account first.`,
      icon: <FaRegWindowRestore size={18} />,
      smallerIcons: <FaYoutube size={14} color={domainColors.Youtube} />,
    },
    {
      setEnable: setEnableVodVolumeOverlay,
      enabled: enableVodVolumeOverlay,
      label: 'Twitch vod volume overlay',
      serviceName: 'Twitch',
      tooltip: twitchAccessToken
        ? (enableVodVolumeOverlay ? 'Disable ' : 'Enable ') + `vod volume-overlay`
        : `Need to connect/authenticate with a Youtube account first.`,
      icon: <MdCrop169 size={18} />,
      smallerIcons: <MdVideocam size={14} color={domainColors.Twitch} />,
    },
  ];

  return (
    <>
      <div style={{ minHeight: 'calc(100% - 120px)' }}>
        <AccountDetails />
        <ToggleButtonsContainerHeader>Feeds</ToggleButtonsContainerHeader>
        <ToggleButtonsContainer buttonsperrow={3}>
          {feedsBtns?.map((props, index) => {
            return (
              <ToggleButton
                key={props.serviceName + index}
                scrollIntoView
                setEnable={feedProps[`setEnable${props.serviceName}`]}
                enabled={feedProps[`enable${props.serviceName}`]}
                {...props}
              />
            );
          })}
        </ToggleButtonsContainer>
        {feedProps.enableTwitter && (
          <div style={{ padding: '5px' }}>
            <TwitterForms />
            <UpdateTwitterLists style={{ opacity: '0.5', transition: 'opacity 250ms' }} />
          </div>
        )}
        <br />
        {feedProps.enableFeedSections && <FeedSectionAdd />}
        <br />
        <ToggleButtonsContainerHeader>Settings</ToggleButtonsContainerHeader>
        <FeedSizeSlider />
        <ToggleButtonsContainer buttonsperrow={3}>
          {settingsButtons.map(
            ({ setEnable, enabled, label, serviceName, tooltip, icon, smallerIcons }, index) => {
              return (
                <ToggleButton
                  key={serviceName + index}
                  setEnable={setEnable}
                  enabled={enabled}
                  label={label}
                  serviceName={serviceName}
                  tooltip={tooltip}
                  icon={icon}
                  smallerIcons={smallerIcons}
                />
              );
            }
          )}
        </ToggleButtonsContainer>
        <br />
        <ReAuthenticateButton
          disconnect={() =>
            disconnectTwitch({ setTwitchAccessToken, setEnableTwitch: feedProps.setEnableTwitch })
          }
          serviceName='Twitch'
        />
        <ReAuthenticateButton
          disconnect={() =>
            disconnectYoutube({
              setYoutubeAccessToken,
              setEnableYoutube: feedProps.setEnableYoutube,
            })
          }
          serviceName='Youtube'
        />
        <Themeselector />
      </div>
      <StyledLogoutContiner>
        <Settings />
      </StyledLogoutContiner>
    </>
  );
};

export default SidebarAccount;
