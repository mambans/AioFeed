import React from 'react';
import ToolTip from '../../sharedComponents/ToolTip';

import { HideChatButton, OpenChatButton } from './StyledComponents';

export default ({ hideChat, switched, onClick, style }) => {
  return (
    <ToolTip
      placement={'left'}
      delay={{ show: 500, hide: 0 }}
      tooltip={`${hideChat ? 'Open chat' : 'Hide chat'}`}
      width='max-content'
    >
      {hideChat ? (
        <OpenChatButton
          hidechat={String(hideChat)}
          switched={String(switched)}
          onClick={onClick}
          style={style}
        />
      ) : (
        <HideChatButton
          hidechat={String(hideChat)}
          switched={String(switched)}
          onClick={onClick}
          style={style}
        />
      )}
    </ToolTip>
  );
};
