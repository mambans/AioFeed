import React, { useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { StyledToggleButton } from "./StyledComponent";
import { AddCookie } from "../../../util/Utils";

export default ({ setEnable, enabled, label, tokenExists, tooltip, icon, buttonsperrow }) => {
  const [checked, setChecked] = useState(enabled || false);

  function handleChange() {
    setEnable(!checked);
    setChecked(!checked);
    AddCookie(`${label}_FeedEnabled`, !checked);
  }

  return (
    <OverlayTrigger
      key={"bottom"}
      placement={"bottom"}
      delay={{ show: 200, hide: 0 }}
      overlay={<Tooltip id={`tooltip-${"bottom"}`}>{tooltip}</Tooltip>}>
      <StyledToggleButton
        onClick={handleChange}
        disabled={!tokenExists}
        variant='dark'
        buttonsperrow={buttonsperrow}
        enabled={checked.toString()}>
        {icon}
      </StyledToggleButton>
    </OverlayTrigger>
  );
};
