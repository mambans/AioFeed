import React, { useState, useEffect } from "react";
import Switch from "react-switch";

import styles from "./Account.module.scss";

function ToggleSwitchVideoHover({ data }) {
  //eslint-disable-next-line
  const [refresh, setRefresh] = useState();
  const [checked, setChecked] = useState(
    localStorage.getItem(`${data.feed}VideoHoverEnabled`) === "true"
  );

  function handleChange(checked) {
    if (localStorage.getItem(`${data.feed}VideoHoverEnabled`)) {
      setChecked(checked);
      localStorage.setItem(`${data.feed}VideoHoverEnabled`, checked);
    }
  }

  useEffect(() => {
    localStorage.setItem(`${data.feed}VideoHoverEnabled`, checked);

    setRefresh(data.refresh);
  }, [checked, data.feed, data.refresh]);

  return (
    <label className={styles.ToggleSwitch}>
      <span>{data.feed + " hover-video"}</span>
      <Switch onChange={handleChange} checked={checked} />
    </label>
  );
}

export default ToggleSwitchVideoHover;
