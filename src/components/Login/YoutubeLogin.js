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
        // const { setLoggedIn } = this.context;
        console.log("getAccessToken");

        const url = new URL(window.location.href).hash;
        console.log("url: ", url);

        // const authCode = url.searchParams.get("#access_token");
        const authCode = url
            .split("#")[1]
            .split("&")[0]
            .slice(13);

        // const asd = authCode.slice(13);
        // console.log("TCL: youtubeAuth -> getAccessToken -> asd", asd);

        console.log("authCode: ", authCode);

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

// Auth.contextType = AuthContext;

export default youtubeAuth;
