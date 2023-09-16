import { Auth } from "aws-amplify";
import React, { useState } from "react";
import { Breadcrumb, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import useInput from "../../hooks/useInput";
import { useUser, useUserSetUser } from "../../stores/user";

const VerifyEmail = ({ onClose }) => {
	const user = useUser();
	const setUser = useUserSetUser();

	const [loading, setLoading] = useState();
	const [error, setError] = useState();

	const { value: code, bind: bindCode } = useInput("", { trim: true });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const result = await Auth.verifyCurrentUserAttributeSubmit("email", code.trim());
			console.log("result:", result);
			if (result) {
				toast.success("Email verified");
				setUser(await Auth.currentAuthenticatedUser());
				setLoading(false);
				onClose?.();
			}
		} catch (e) {
			setError(e.message);
			setLoading(false);
			console.log("Error", e);
		}
	};

	return (
		<div>
			{onClose && (
				<Breadcrumb>
					<Breadcrumb.Item onClick={onClose}>Edit</Breadcrumb.Item>
					<Breadcrumb.Item active>Verify email</Breadcrumb.Item>
				</Breadcrumb>
			)}
			{user.attributes?.email_verified ? (
				<p>User already verified</p>
			) : (
				<Form>
					<Form.Group>
						<Form.Label>Code</Form.Label>
						<Form.Control size="lg" required placeholder="Code" {...bindCode} isInvalid={error} />
						<Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
						<Form.Text>Please check your email ({user?.attributes?.email}) for a confirmation code.</Form.Text>
					</Form.Group>

					<Button onClick={handleSubmit} disabled={loading}>
						{loading ? <Spinner animation="border" role="status" /> : "Submit"}
					</Button>
				</Form>
			)}
		</div>
	);
};
export default VerifyEmail;
