import React, { useState } from "react";
import Switch from "react-switch";

import styles from "./Account.module.scss";

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
    <label className={styles.ToggleSwitch}>
      <span>{data.label}</span>
      <Switch
        disabled={!data.tokenExists}
        onChange={handleChange}
        checked={tokenExists && checked}
      />
    </label>
  );
};
