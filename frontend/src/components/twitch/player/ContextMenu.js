import React from 'react';
import { MdHighQuality } from 'react-icons/md';
import { GrRefresh } from 'react-icons/gr';
import ContextMenu from './ContextMenuWrapper';
import { setLocalStorage } from '../../../util';

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
  return (
    <ContextMenu
      outerContainer={PlayerUIControlls}
      showAndResetTimer={showAndResetTimer}
      children={
        setChatState && (
          <>
            <li onClick={() => TwitchPlayer?.setQuality('chunked')}>
              <MdHighQuality size={24} />
              {'Max quality (Source)'}
            </li>
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
        )
      }
    />
  );
};
export default PlayerContextMenu;
