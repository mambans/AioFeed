import React, { Component, useState, useEffect } from "react";
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

// class ToggleSwitchs extends Component {
//   constructor(props) {
//     super();
//     this.state = {
//       checked: localStorage.getItem(props.data.label + "FeedEnabled") === "true",
//       tokenExists: Utilities.getCookie(`${props.data.token}-access_token`) ? true : false,
//     };
//     this.handleChange = this.handleChange.bind(this);
//   }

//   handleChange(checked) {
//     if (Utilities.getCookie(`${this.props.data.token}-access_token`)) {
//       this.setState({ checked });
//       localStorage.setItem(this.props.data.label + "FeedEnabled", checked);
//     }
//   }

//   // componentWillMount() {
//   //   console.log(this.props.data.disable);

//   //   if (
//   //     !Utilities.getCookie(`${this.props.data.token}-access_token`) &&
//   //     this.props.data.disable === true
//   //   )
//   //     this.setState({
//   //       disable: true,
//   //     });
//   // }

//   render() {
//     return (
//       <label className={styles.ToggleSwitch}>
//         <span>{this.props.data.label}</span>
//         <Switch
//           disabled={!this.state.tokenExists}
//           onChange={this.handleChange}
//           checked={this.state.checked && this.state.tokenExists}
//         />
//       </label>
//     );
//   }
// }

export default ToggleSwitch;
