import React, { useState, useEffect } from "react";
import Switch from "react-switch";

import styles from "./Account.module.scss";
import Utilities from "utilities/Utilities";

function ToggleSwitch(data) {
  const [checked, setChecked] = useState(
    localStorage.getItem(data.data.label + "FeedEnabled") === "true"
  );
  const [tokenExists, setTokenExists] = useState(
    Utilities.getCookie(`${data.data.token}-access_token`) ? true : false
  );

  function handleChange(checked) {
    console.log("checked: ", checked);

    if (Utilities.getCookie(`${data.data.token}-access_token`)) {
      setChecked(checked);
      localStorage.setItem(data.data.label + "FeedEnabled", checked);
    }
  }

  useEffect(() => {
    setTokenExists(Utilities.getCookie(`${data.data.token}-access_token`) ? true : false);
  }, [data.data.token]);

  return (
    <label className={styles.ToggleSwitch}>
      <span>{data.data.label}</span>
      <Switch disabled={!tokenExists} onChange={handleChange} checked={checked && tokenExists} />
    </label>
  );
}

export default ToggleSwitch;
