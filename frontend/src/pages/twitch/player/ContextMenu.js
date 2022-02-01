import React from 'react';
import { MdHighQuality } from 'react-icons/md';
import { GrRefresh } from 'react-icons/gr';
import ContextMenu, { ContextMenuDropDown } from './ContextMenuWrapper';
import { setLocalStorage } from '../../../util';
import { MdOutlineHighQuality } from 'react-icons/md';

const PlayerContextMenu = ({
  PlayerUIControlls,
  TwitchPlayer,
  showAndResetTimer,
  setChatState,
  children,
  DEFAULT_CHAT_WIDTH,
  chatState,
  channelName,
}) => {
  const Qualities = () => {
    if (!TwitchPlayer?.getQualities() || !TwitchPlayer?.getQualities()?.length) return null;

    return (
      <>
        <li onClick={() => TwitchPlayer?.setQuality('chunked')}>
          <MdHighQuality size={24} />
          {'Max quality (Source)'}
        </li>
        <ContextMenuDropDown
          trigger={
            <>
              <MdOutlineHighQuality size={24} />
              Qualities
            </>
          }
        >
          {TwitchPlayer?.getQualities()
            ?.filter((q) => q.group !== 'chunked')
            ?.map((q, index) => (
              <li key={q.name || index} onClick={() => TwitchPlayer?.setQuality(q.group)}>
                {q.name}
              </li>
            ))}
        </ContextMenuDropDown>
      </>
    );
  };

  const ChatSettings = () => {
    if (!setChatState) return null;
    return (
      <>
        {children}
        <li
          onClick={() => {
            setChatState({
              chatWidth: DEFAULT_CHAT_WIDTH,
              switchChatSide: false,
              hideChat: false,
            });
          }}
        >
          <GrRefresh size={24} />
          {'Reset chat position'}
        </li>
        <li
          onClick={() => {
            const confirmed = window.confirm('Reset ALL chat positions?');
            if (confirmed) {
              setLocalStorage('TwitchChatState', {
                [channelName?.toLowerCase()]: chatState,
              });

              setChatState({
                chatWidth: DEFAULT_CHAT_WIDTH,
                switchChatSide: false,
                hideChat: false,
              });
            }
          }}
        >
          <GrRefresh size={24} />
          {'Reset ALL chat positions'}
        </li>
      </>
    );
  };

  return (
    <ContextMenu
      outerContainer={PlayerUIControlls}
      showAndResetTimer={showAndResetTimer}
      children={
        <>
          <Qualities />
          <ChatSettings />
        </>
      }
    />
  );
};
export default PlayerContextMenu;
