import React, { useState, useEffect } from "react";
import Switch from "react-switch";

import styles from "./Account.module.scss";
import Utilities from "../../utilities/Utilities";

function ToggleSwitch({ data }) {
  //eslint-disable-next-line
  const [refresh, setRefresh] = useState();
  const [checked, setChecked] = useState(
    localStorage.getItem(data.label + "FeedEnabled") === "true" &&
      Utilities.getCookie(`${data.token}-access_token`) !== null &&
      Utilities.getCookie(`${data.token}-access_token`) !== "null"
  );
  const [tokenExists, setTokenExists] = useState(
    // !Utilities.getCookie(`${data.token}-access_token`) ||
    Utilities.getCookie(`${data.token}-access_token`) === null ||
      Utilities.getCookie(`${data.token}-access_token`) === "null"
      ? false
      : true
  );

  function handleChange(checked) {
    if (Utilities.getCookie(`${data.token}-access_token`)) {
      setChecked(checked);
      // document.cookie = `${data.label}FeedEnabled=${checked}; path=/`;
      localStorage.setItem(data.label + "FeedEnabled", checked);
    }
  }

  useEffect(() => {
    localStorage.setItem(data.label + "FeedEnabled", checked);
    setRefresh(data.refresh);
    setTokenExists(
      Utilities.getCookie(`${data.token}-access_token`) === null ||
        Utilities.getCookie(`${data.token}-access_token`) === "null"
        ? false
        : true
    );
  }, [checked, data.label, data.refresh, data.token]);

  return (
    <label className={styles.ToggleSwitch}>
      <span>{data.label}</span>
      <Switch disabled={!tokenExists} onChange={handleChange} checked={checked && tokenExists} />
    </label>
  );
}

export default ToggleSwitch;
