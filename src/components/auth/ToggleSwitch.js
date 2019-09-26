import React, { Component } from "react";
import Switch from "react-switch";

import styles from "./Auth.module.scss";

// function ToggleSwitch(data) {
//   const [checked, setChecked] = useState(false);

//   function handleChange(checked) {
//     setChecked({ checked });
//   }

//   return (
//     <label>
//       <span>{data.data.label}</span>
//       <Switch onChange={handleChange} checked={checked} />
//     </label>
//   );
// }

class ToggleSwitch extends Component {
  constructor(props) {
    super();
    this.state = {
      checked: localStorage.getItem(props.data.label + "FeedEnabled") === "true",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(checked) {
    this.setState({ checked });
    localStorage.setItem(this.props.data.label + "FeedEnabled", checked);
  }

  render() {
    return (
      <label className={styles.ToggleSwitch}>
        <span>{this.props.data.label}</span>
        <Switch onChange={this.handleChange} checked={this.state.checked} />
      </label>
    );
  }
}

export default ToggleSwitch;
