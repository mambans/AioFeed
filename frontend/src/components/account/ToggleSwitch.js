import React, { useState } from "react";
import Switch from "react-switch";

import { StyledToggleSwitch } from "./styledComponent";

export default ({ setEnable, enabled, label, tokenExists }) => {
  const [checked, setChecked] = useState(enabled || false);

  function handleChange(checked) {
    setEnable(checked);
    setChecked(checked);
    localStorage.setItem(label + "FeedEnabled", checked);
    document.cookie = `${label}_feedEnabled=${checked}; path=/`;
  }

  return (
    <StyledToggleSwitch title={(checked ? "Disable" : "Enable") + ` ${label} feed`}>
      <Switch
        disabled={!tokenExists}
        onChange={handleChange}
        checked={(tokenExists && checked) || false}
      />
      <span>{label}</span>
    </StyledToggleSwitch>
  );
};
