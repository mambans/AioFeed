import Alert from "react-bootstrap/Alert";
import React from "react";

import Utilities from "./../../utilities/Utilities";

class ErrorHandeling extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: this.props.data, info: null };
  }

  ErrorHandelingText() {
    let error;

    switch (this.props.data.message) {
      case "Network Error":
        error = this.props.data.message + " -Database server may be offline.";
        break;
      default:
        error = this.props.data.message;
    }

    this.setState({
      error,
    });
  }

  componentDidMount() {
    this.ErrorHandelingText();
  }

  render() {
    const { error } = this.state;
    return (
      <Alert variant="warning" style={Utilities.alertWarning}>
        <Alert.Heading>Oh-oh! Something bad happened.</Alert.Heading>
        <hr />
        {error.toString()}
      </Alert>
    );
  }
}

export default ErrorHandeling;
