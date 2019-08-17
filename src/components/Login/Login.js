import React from "react";
// import { OauthSender } from "react-oauth-flow";

import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Utilities from "utilities/utilities";
import axios from "axios";
import { AuthContext } from "components/Login/AuthContextProvider";

class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.title = "Login";
    }

    async getAccessToken() {
        const { setLoggedIn } = this.context;
        console.log("getAccessToken");

        const url = new URL(window.location.href);
        const authCode = url.searchParams.get("code");
        const response = await axios.post(`https://id.twitch.tv/oauth2/token
?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}
&client_secret=${process.env.REACT_APP_TWITCH_SECRET}
&code=${authCode}
&grant_type=authorization_code
&redirect_uri=http://localhost:3000/twitch/auth`);

        console.log("res: ", response);

        localStorage.setItem("access_token", response.data.access_token);

        setLoggedIn(true);
    }

    componentDidMount() {
        this.getAccessToken();
    }

    render() {
        const { loggedIn } = this.context;
        if (loggedIn) {
            return (
                <Alert variant="success" style={Utilities.alertWarning}>
                    <Alert.Heading>Successfully logged in</Alert.Heading>
                    <hr />
                </Alert>
            );
        }

        return (
            <Spinner animation="border" role="status" style={Utilities.loadingSpinner}>
                <span className="sr-only">Loading...</span>
            </Spinner>
        );
    }
}

Auth.contextType = AuthContext;

export default Auth;
