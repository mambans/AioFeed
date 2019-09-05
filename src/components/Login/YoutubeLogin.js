import React from "react";
// import { OauthSender } from "react-oauth-flow";

import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Utilities from "utilities/utilities";
//eslint-disable-next-line
import { AuthContext } from "components/Login/AuthContextProvider";

class youtubeAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: false };
    this.title = "Login";
  }

  async access() {
    this.setState({
      loggedIn: true,
    });
  }

  async getAccessToken() {
    const url = new URL(window.location.href).hash;

    const authCode = url
      .split("#")[1]
      .split("&")[0]
      .slice(13);

    localStorage.setItem("Youtube-access_token", authCode);

    this.setState({
      loggedIn: true,
    });
  }

  componentDidMount() {
    this.getAccessToken();
  }

  render() {
    const { loggedIn } = this.state;
    if (loggedIn) {
      return (
        <>
          <Alert variant="success" style={Utilities.alertWarning}>
            <Alert.Heading>Successfully logged in</Alert.Heading>
            <hr />
          </Alert>
        </>
      );
    }
    return (
      <>
        <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
          <span className="sr-only">Loading...</span>
        </Spinner>
      </>
    );
  }
}

export default youtubeAuth;
