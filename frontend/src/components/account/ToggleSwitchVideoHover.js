import React, { useState } from "react";
import Switch from "react-switch";

import { StyledToggleSwitch } from "./styledComponent";

function ToggleSwitchVideoHover(props) {
  const [checked, setChecked] = useState(props.enableHover);

  function handleChange(checked) {
    if (localStorage.getItem(`${props.feed}VideoHoverEnabled`)) {
      setChecked(checked);
      props.setEnableHover(checked);
      localStorage.setItem(`${props.feed}VideoHoverEnabled`, checked);
    }
    console.log("TCL: handleChange -> checked", checked);
  }

  return (
    <StyledToggleSwitch title={(checked ? "Disable" : "Enable") + ` ${props.feed} video on hover`}>
      <Switch onChange={handleChange} checked={checked} />
      <span>{props.feed + " hover-video"}</span>
    </StyledToggleSwitch>
  );
}

export default ToggleSwitchVideoHover;
