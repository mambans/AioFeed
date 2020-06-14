import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { HideChatButton, OpenChatButton } from "./StyledComponents";

export default ({ hideChat, switched, onClick, style }) => {
  return (
    <OverlayTrigger
      key={"left"}
      placement={"left"}
      delay={{ show: 500, hide: 0 }}
      overlay={
        <Tooltip id={`tooltip-${"left"}`}>{`${hideChat ? "Open chat" : "Hide chat"}`}</Tooltip>
      }>
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
    </OverlayTrigger>
  );
};
