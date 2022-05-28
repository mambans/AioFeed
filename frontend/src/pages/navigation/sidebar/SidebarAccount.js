import React, { useContext, useEffect } from 'react';
import { MdVideocam, MdAutorenew, MdCrop169 } from 'react-icons/md';
import { FaTwitch, FaYoutube, FaTwitter, FaRegWindowRestore } from 'react-icons/fa';
import { BsCollectionFill } from 'react-icons/bs';
import { FiSidebar } from 'react-icons/fi';
import { TiFlash } from 'react-icons/ti';
import { AiOutlineDisconnect } from 'react-icons/ai';
import { HiViewList, HiRefresh } from 'react-icons/hi';
import { RiFocus2Fill } from 'react-icons/ri';

import AccountContext from './../../account/AccountContext';
import FeedsContext from './../../feed/FeedsContext';
import ReAuthenticateButton from './ReAuthenticateButton';
import Themeselector from './../../../components/themes/Themeselector';
import ToggleButton from './ToggleButton';
import disconnectYoutube from './../../youtube/disconnectYoutube';
import disconnectTwitch from './../../twitch/disconnectTwitch';
import TwitterForms from './TwitterForms';
import { StyledLogoutContiner, ToggleButtonsContainer } from './StyledComponents';
import { TwitchContext } from '../../twitch/useToken';
import { YoutubeContext } from '../../youtube/useToken';
import FeedSizeSlider from './FeedSizeSlider';
import AccountDetails from './AccountDetails';
import NavigationContext from '../NavigationContext';
import Settings from './Settings';
import FeedSectionAdd from '../../feedSections';
import SidebarExpandableSection from './SidebarExpandableSection';
import ListInAccountSidebar from '../../myLists/ListInAccountSidebar';
import Colors from '../../../components/themes/Colors';
import TwitterContext from '../../twitter/TwitterContext';

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
  const { toggleRefreshOnFocus, refreshOnFocusEnabled } = useContext(TwitterContext) || {};

  useEffect(() => {
    if (!username || !authKey) setRenderModal('login');
  }, [username, authKey, setRenderModal]);

  const domainColors = {
    Twitch: Colors.purple,
    Youtube: Colors.red,
    MyLists: Colors.green,
    Twitter: Colors.blue,
    FeedSections: Colors.raspberry,
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
      icon: <BsCollectionFill size={24} color={domainColors.FeedSections} />,
      tooltip: (feedProps.enableMyLists ? 'Disable ' : 'Enable ') + ` MyLists feed`,
      tokenExists: twitchAccessToken,
      mount: feedProps.enableTwitch,
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
    {
      setEnable: toggleRefreshOnFocus,
      enabled: refreshOnFocusEnabled,
      label: 'Refresh twitter on focus',
      serviceName: 'Twitter',
      tooltip: (refreshOnFocusEnabled ? 'Disable ' : 'Enable ') + `focus-refresh`,
      icon: <HiRefresh size={18} />,
      smallerIcons: <RiFocus2Fill size={14} color={domainColors.Twitter} />,
      disabled: false,
    },
  ];

  return (
    <>
      <div style={{ minHeight: 'calc(100% - 120px)' }}>
        <AccountDetails />
        <SidebarExpandableSection title='Feeds'>
          <ToggleButtonsContainer buttonsperrow={3}>
            {feedsBtns
              ?.filter(({ mount }) => mount ?? true)
              ?.map((props, index) => {
                return (
                  <ToggleButton
                    {...props}
                    key={props.serviceName + index}
                    scrollIntoView
                    setEnable={feedProps[`setEnable${props.serviceName}`]}
                    enabled={feedProps[`enable${props.serviceName}`]}
                    mount={props.mount || true}
                  />
                );
              })}
          </ToggleButtonsContainer>
        </SidebarExpandableSection>
        {feedProps.enableTwitter && <TwitterForms />}
        {feedProps.enableFeedSections && <FeedSectionAdd />}
        {feedProps.enableMyLists && <ListInAccountSidebar />}
        <SidebarExpandableSection title='Settings'>
          <FeedSizeSlider />
          <ToggleButtonsContainer buttonsperrow={3}>
            {settingsButtons.map(
              (
                { setEnable, enabled, label, serviceName, tooltip, icon, smallerIcons, disabled },
                index
              ) => {
                return (
                  <ToggleButton
                    key={serviceName + index}
                    setEnable={setEnable}
                    disabled={disabled}
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
          <br style={{ height: '24px' }} />
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
        </SidebarExpandableSection>
      </div>
      <StyledLogoutContiner>
        <Settings />
      </StyledLogoutContiner>
    </>
  );
};

export default SidebarAccount;
