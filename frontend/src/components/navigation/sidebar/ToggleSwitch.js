import React, { useState } from "react";
import Switch from "react-switch";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { StyledToggleSwitch } from "./StyledComponent";

export default ({ setEnable, enabled, label, tokenExists, tooltip, height, width }) => {
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
      overlay={<Tooltip id={`tooltip-${"bottom"}`}>{tooltip}</Tooltip>}>
      <StyledToggleSwitch padding={height ? height / 4 : 5}>
        <Switch
          height={height || 23}
          width={width || 46}
          disabled={!tokenExists}
          onChange={handleChange}
          checked={(tokenExists && checked) || false}
        />
        <span>{label}</span>
      </StyledToggleSwitch>
    </OverlayTrigger>
  );
};
