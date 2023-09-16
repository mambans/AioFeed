import React, { useState } from "react";
import { Breadcrumb, Button, Form } from "react-bootstrap";
import { ButtonGroup } from "../../components/styledComponents";
import useInput from "../../hooks/useInput";
import { useUser, useUserDelete } from "../../stores/user";

const DeleteAccount = ({ onClose }) => {
	const [error, setError] = useState<string | null>("");

	const user = useUser();
	const deleteUser = useUserDelete();

	const { value: username, bind: bindUsername } = useInput("", {}, () => setError(null));

	const handleSubmit = (e) => {
		e.preventDefault();
		if (username !== user?.username) {
			setError("Invalid username");
			return;
		}
		deleteUser();
	};

	return (
		<>
			<Breadcrumb>
				<Breadcrumb.Item onClick={onClose}>Edit</Breadcrumb.Item>
				<Breadcrumb.Item active>Delete</Breadcrumb.Item>
			</Breadcrumb>
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId="formBasicUsername">
					<Form.Label>Username</Form.Label>
					<Form.Control isInvalid={error} required size="lg" placeholder="username" {...bindUsername} />
					<Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
				</Form.Group>

				<ButtonGroup justifyContent="space-between">
					<Button variant="danger" type="submit" disabled={!username || error}>
						Delete
					</Button>
					<Button variant="secondary" onClick={onClose}>
						Close
					</Button>
				</ButtonGroup>
			</Form>
		</>
	);
};
export default DeleteAccount;
