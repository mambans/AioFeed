import React, { useState } from "react";
import Switch from "react-switch";

import { StyledToggleSwitch } from "./StyledComponent";

export default props => {
  const [checked, setChecked] = useState(props.enableHover);

  function handleChange(checked) {
    setChecked(checked);
    props.setEnableHover(checked);
    localStorage.setItem(`${props.feed}VideoHoverEnabled`, checked);
  }

  return (
    <StyledToggleSwitch title={(checked ? "Disable" : "Enable") + ` ${props.feed} video on hover`}>
      <Switch onChange={handleChange} checked={checked} />
      <span>{props.feed + " hover-video"}</span>
    </StyledToggleSwitch>
  );
};
