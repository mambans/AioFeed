import React, { useReducer, useState } from "react";
import { Breadcrumb, Form } from "react-bootstrap";
import LoadingIndicator from "../../components/LoadingIndicator";
import useInput from "../../hooks/useInput";
import { InlineError, StyledCreateForm, StyledCreateFormTitle } from "../navigation/sidebar/StyledComponents";
import { Auth } from "aws-amplify";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import { useSetNavigationData, useSetNavigationSidebarVisible } from "../../stores/navigation";

const SignUp = () => {
	const setNavigationSidebarVisible = useSetNavigationSidebarVisible();
	const setNavigationData = useSetNavigationData();

	const { value: username, bind: bindUsername } = useInput("");
	const { value: email, bind: bindEmail } = useInput("");
	const { value: password, bind: bindPassword } = useInput("");
	const [loading, setLoading] = useState();

	const [error, setError] = useReducer((state, error) => {
		switch (error?.message || error) {
			case "User is not confirmed.":
				return "Check your email for confirmation link";
			case "Missing required parameter USERNAME":
			case "Username cannot be empty":
				return "Please enter a username";
			case "User is disabled.":
				return "Your account is disabled";
			default:
				return error?.message;
		}
	}, null);

	const handleSubmit = (evt) => {
		evt.preventDefault();
		setError(null);
		setLoading(true);

		Auth.signUp({
			username,
			password,
			attributes: {
				email,
			},
		})
			.then((data) => {
				setError(error);
				setLoading(false);

				if (data) {
					setNavigationSidebarVisible(true, "account");
					setNavigationData({
						text: (
							<span style={{ display: "flex", flexWrap: "wrap" }}>
								Confirmation link sent to <b>{email}</b>,<span>please check you'r email.</span>
							</span>
						),
					});
				}
			})
			.catch((error) => {
				setError(error);
				setLoading(false);
			});
	};

	return (
		<>
			<Breadcrumb>
				<Breadcrumb.Item onClick={() => setNavigationSidebarVisible(true, "signin")}>Sign in</Breadcrumb.Item>
				<Breadcrumb.Item active={true} onClick={() => setNavigationSidebarVisible(true, "signout")}>
					Sign out
				</Breadcrumb.Item>
			</Breadcrumb>
			<StyledCreateFormTitle>Sign Up</StyledCreateFormTitle>
			<StyledCreateForm onSubmit={handleSubmit} noValidate validated={true}>
				<Form.Group controlId="formGroupUserName">
					<Form.Label>Username</Form.Label>
					<Form.Control type="text" placeholder="Username" name="username" required {...bindUsername} />
				</Form.Group>
				<Form.Group controlId="formGroupEmail">
					<Form.Label>Email address</Form.Label>
					<Form.Control type="email" placeholder="Enter email" required {...bindEmail} />
				</Form.Group>
				<Form.Group controlId="formGroupPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control type="password" placeholder="Password" required {...bindPassword} />
				</Form.Group>
				<Button variant="primary" type="submit" disabled={!username || !password || !email} loading={loading} style={{ margin: "1rem 0" }}>
					Create
				</Button>

				{error && <InlineError>{error}</InlineError>}
			</StyledCreateForm>
			{loading && <LoadingIndicator height={150} width={150} />}{" "}
			<Link style={{ position: "absolute", bottom: "20px", left: "20px", color: "#ffffff" }} to="/legality#Privacy">
				Privacy Notice
			</Link>
		</>
	);
};
export default SignUp;
