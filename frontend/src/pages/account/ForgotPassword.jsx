import React, { useReducer, useState } from "react";
import { Breadcrumb, Form, Spinner } from "react-bootstrap";
import useInput from "../../hooks/useInput";
import { Auth } from "aws-amplify";
import { InlineError } from "../navigation/sidebar/StyledComponents";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import { useSetNavigationSidebarVisible } from "../../stores/navigation";

const ForgotPassword = () => {
	const setNavigationSidebarVisible = useSetNavigationSidebarVisible();

	const [error, setError] = useReducer((state, error) => {
		switch (error?.message) {
			case "User is not confirmed.":
				return "Check your email for confirmation link";
			case "Missing required parameter USERNAME":
				return "Please enter your username";
			case "User is disabled.":
				return "Your account is disabled";
			default:
				return error?.message;
		}
	}, null);
	const [submitted, setSubmitted] = useState();
	const [loading, setLoading] = useState();

	const { value: username, bind: bindUsername } = useInput("");
	const { value: code, bind: bindCode } = useInput("");
	const { value: new_password, bind: bindNewPassword } = useInput("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		console.log("username:", username);
		try {
			if (submitted) {
				const passwordsubmitRes = await Auth.forgotPasswordSubmit(username, code, new_password);
				console.log("passwordsubmitRes:", passwordsubmitRes);
				if (passwordsubmitRes === "SUCCESS") {
					toast.success("Password successfully reset, please login.");
					setNavigationSidebarVisible(true, "signin");
				}
			} else {
				const res = await Auth.forgotPassword(username);
				console.log("res:", res);
				if (res) {
					setSubmitted(true);
				}
			}
			setLoading(false);
		} catch (error) {
			setError(error);
			setLoading(false);
		}
	};

	return (
		<>
			<Breadcrumb>
				<Breadcrumb.Item onClick={() => setNavigationSidebarVisible(true, "signin")}>Sign in</Breadcrumb.Item>
				<Breadcrumb.Item active={true} onClick={() => setNavigationSidebarVisible(true, "forgotpassword")}>
					forgot password
				</Breadcrumb.Item>
			</Breadcrumb>

			<Form onSubmit={handleSubmit}>
				{error && <InlineError>{error}</InlineError>}

				<Form.Group>
					<Form.Label>Username</Form.Label>
					<Form.Control type="text" placeholder="Username" name="username" required {...bindUsername} disabled={submitted} />
				</Form.Group>
				{submitted && (
					<>
						<Form.Group>
							<Form.Label>Code</Form.Label>
							<Form.Control type="text" placeholder="Code" name="Code" required {...bindCode} />
						</Form.Group>
						<Form.Group>
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" placeholder="Password" name="Password" required {...bindNewPassword} />
						</Form.Group>
					</>
				)}
				<Button type="submit" variant="primary" style={{ margin: "1rem 0" }} loading={loading}>
					Next {loading && <Spinner />}
				</Button>
			</Form>
		</>
	);
};
export default ForgotPassword;
