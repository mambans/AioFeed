import React, { useState } from "react";
import Switch from "react-switch";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { StyledToggleSwitch } from "./StyledComponent";

export default ({ setEnable, enabled, label, tokenExists }) => {
  const [checked, setChecked] = useState(enabled || false);

  function handleChange(checked) {
    setEnable(checked);
    setChecked(checked);
    document.cookie = `${label}_FeedEnabled=${checked}; path=/`;
  }

  return (
    <OverlayTrigger
      key={"bottom"}
      placement={"left"}
      delay={{ show: 500, hide: 0 }}
      overlay={
        <Tooltip id={`tooltip-${"bottom"}`}>
          {tokenExists
            ? (checked ? "Disable" : "Enable") + ` ${label} feed`
            : `Need to connect/authenticate with a ${label} account first.`}
        </Tooltip>
      }>
      <StyledToggleSwitch>
        <Switch
          disabled={!tokenExists}
          onChange={handleChange}
          checked={(tokenExists && checked) || false}
        />
        <span>{label}</span>
      </StyledToggleSwitch>
    </OverlayTrigger>
  );
};
