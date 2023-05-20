import React, { useContext, useReducer, useState } from "react";
import { Breadcrumb, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";
import { ThemeSelector } from "../../components/themes/styledComponents";
import useInput from "../../hooks/useInput";
import { InlineError, StyledCreateForm, StyledCreateFormTitle } from "../navigation/sidebar/StyledComponents";
import Button from "../../components/Button";
import { useSetRecoilState } from "recoil";
import { navigationSidebarComponentKeyAtom } from "../navigation/atoms";
import useUserStore from "../../stores/userStore";

const SignIn = ({ text }) => {
	const { signIn, loading, error: rawError } = useUserStore();
	const setNavigationSidebarComponentKey = useSetRecoilState(navigationSidebarComponentKeyAtom);

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
		//     setNavigationSidebarComponentKey({ comp: 'account' });
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
				<Breadcrumb.Item active={true} onClick={() => setNavigationSidebarComponentKey({ comp: "signin" })}>
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
			<Button variant="link" onClick={() => setNavigationSidebarComponentKey({ comp: "SignUp" })}>
				Don't have an account? Create an account here!
			</Button>
			<Button variant="link" onClick={() => setNavigationSidebarComponentKey({ comp: "ForgotPassword" })}>
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
