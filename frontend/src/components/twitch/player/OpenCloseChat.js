import React from "react";

import { HideChatButton, OpenChatButton } from "./StyledComponents";

export default ({ hideChat, switched, onClick }) => {
  if (hideChat) {
    return (
      <OpenChatButton
        title='Open chat'
        hidechat={hideChat.toString()}
        switched={switched.toString()}
        onClick={onClick}
      />
    );
  } else {
    return (
      <HideChatButton
        title='Hide chat'
        hidechat={hideChat.toString()}
        switched={switched.toString()}
        onClick={onClick}
      />
    );
  }
};
