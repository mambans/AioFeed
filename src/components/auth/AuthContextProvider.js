import React from "react";

const AuthContext = React.createContext();

class AuthContextProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loggedIn: !!localStorage.getItem("access_token") };
    }

    render() {
        const value = {
            loggedIn: this.state.loggedIn,
            setLoggedIn: loggedIn => {
                this.setState({
                    loggedIn,
                });
            },
        };
        return <AuthContext.Provider {...this.props} value={value} />;
    }
}

export default AuthContextProvider;
export { AuthContext };
