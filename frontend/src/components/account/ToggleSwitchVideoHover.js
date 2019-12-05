import React, { useState } from "react";
import Switch from "react-switch";

import styles from "./Account.module.scss";

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
    <label className={styles.ToggleSwitch}>
      <span>{props.feed + " hover-video"}</span>
      <Switch onChange={handleChange} checked={checked} />
    </label>
  );
}

export default ToggleSwitchVideoHover;