import React, { useState } from "react";
import Switch from "react-switch";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { StyledToggleSwitch } from "./StyledComponent";
import { AddCookie } from "../../../util/Utils";

export default ({ setEnable, enabled, label, tokenExists, tooltip, height, width, icon }) => {
  const [checked, setChecked] = useState(enabled || false);

  function handleChange(checked) {
    setEnable(checked);
    setChecked(checked);
    AddCookie(`${label}_FeedEnabled`, checked);
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
        {icon}
        <span>{label}</span>
      </StyledToggleSwitch>
    </OverlayTrigger>
  );
};
