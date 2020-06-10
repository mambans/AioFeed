import React from "react";

import { HideChatButton, OpenChatButton } from "./StyledComponents";

export default ({ hideChat, switched, onClick, style }) => {
  if (hideChat) {
    return (
      <OpenChatButton
        title='Open chat'
        hidechat={String(hideChat)}
        switched={String(switched)}
        onClick={onClick}
        style={style}
      />
    );
  } else {
    return (
      <HideChatButton
        title='Hide chat'
        hidechat={String(hideChat)}
        switched={String(switched)}
        onClick={onClick}
        style={style}
      />
    );
  }
};
