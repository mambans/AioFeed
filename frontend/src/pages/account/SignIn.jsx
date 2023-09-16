import React from "react";
import { Breadcrumb, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";
import { ThemeSelector } from "../../components/themes/styledComponents";
import useInput from "../../hooks/useInput";
import { InlineError, StyledCreateForm, StyledCreateFormTitle } from "../navigation/sidebar/StyledComponents";
import Button from "../../components/Button";

import { useUserError, useUserLoading, useUserSignIn } from "../../stores/user";
import { useSetNavigationSidebarVisible } from "../../stores/navigation";

const SignIn = ({ text }) => {
	const signIn = useUserSignIn();
	const loading = useUserLoading();
	const { error: rawError } = useUserError();

	const setNavigationSidebarVisible = useSetNavigationSidebarVisible();

	const { value: username, bind: bindUsername } = useInput("");
	const { value: password, bind: bindPassword } = useInput("");
	const error = (() => {
		switch (rawError?.message) {
			case "User is not confirmed.":
				return "Check your email for confirmation link";
			case "Missing required parameter USERNAME":
				return "Please enter your username";
			case "User is disabled.":
				return "Your account is disabled";
			default:
				return rawError?.message;
		}
	})();

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		signIn({ username, password });

		// await authenticate({ username, password })
		//   .then((data) => {
		//     console.log('Logged in data:', data);

		//     setLoading(false);
		//     setNavigationSidebarVisible(true, 'account' );
		//   })
		//   .catch((error) => {
		//     console.log('errorrrrrrrrrrr:', error);
		//     setLoading(false);
		//     setError(error);
		//   });
	};

	return (
		<>
			<Breadcrumb>
				<Breadcrumb.Item active={true} onClick={() => setNavigationSidebarVisible(true, "signin")}>
					Sign in
				</Breadcrumb.Item>
			</Breadcrumb>
			<StyledCreateFormTitle>Sign In</StyledCreateFormTitle>
			{text && <p style={{ margin: "1rem 0" }}>{text}</p>}
			<StyledCreateForm onSubmit={handleSubmit} noValidate validated={true}>
				<Form.Group controlId="formGroupUserName">
					<Form.Label>Username</Form.Label>
					<Form.Control type="text" placeholder="Username" name="username" required {...bindUsername} />
				</Form.Group>

				<Form.Group controlId="formGroupPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control type="password" placeholder="Password" required {...bindPassword} />
				</Form.Group>

				<Button variant="primary" type="submit" disabled={!username || !password} loading={loading} style={{ margin: "1rem 0" }}>
					Sign In
				</Button>

				{error && <InlineError>{error}</InlineError>}
			</StyledCreateForm>
			<ThemeSelector style={{ marginTop: "20px" }} />
			<Button variant="link" onClick={() => setNavigationSidebarVisible(true, "SignUp")}>
				Don't have an account? Create an account here!
			</Button>
			<Button variant="link" onClick={() => setNavigationSidebarVisible(true, "ForgotPassword")}>
				Forgot password?
			</Button>
			{loading && <LoadingIndicator height={150} width={150} />}
			<Link style={{ position: "absolute", bottom: "20px", left: "20px", color: "#ffffff" }} to="/legality#Privacy">
				Privacy Notice
			</Link>
		</>
	);
};
export default SignIn;
