import React, { useState } from "react";
import Switch from "react-switch";

import { StyledToggleSwitch } from "./styledComponent";

export default data => {
  const [checked, setChecked] = useState(data[`enable${data.label}`]);
  const [tokenExists] = useState(data.tokenExists || false);

  function handleChange(checked) {
    switch (data.label) {
      case "Twitch":
        data.setEnableTwitch(checked);
        break;
      case "TwitchVods":
        data.setEnableTwitchVods(checked);
        break;
      case "Youtube":
        data.setEnableYoutube(checked);
        break;

      default:
        break;
    }
    setChecked(checked);
    localStorage.setItem(data.label + "FeedEnabled", checked);
  }

  return (
    <StyledToggleSwitch title={(checked ? "Disable" : "Enable") + ` ${data.label} feed`}>
      <Switch
        disabled={!data.tokenExists}
        onChange={handleChange}
        checked={tokenExists && checked}
      />
      <span>{data.label}</span>
    </StyledToggleSwitch>
  );
};
