import React, { useState } from "react";
import { InlineError } from "./StyledComponents";
import { BiRefresh } from "react-icons/bi";
import styled from "styled-components";
import ToolTip from "../../../components/tooltip/ToolTip";
import styles from "./Sidebar.module.scss";
import VerifyEmail from "../../account/VerifyEmail";
import { Modal } from "react-bootstrap";
import { useUser, useUserResendEmailVerify } from "../../../stores/user";

const AccountDetails = () => {
	const user = useUser();
	const resendEmailVerify = useUserResendEmailVerify();
	const [verifyIsOpen, setVerifyIsOpen] = useState();

	return (
		<>
			<h1 style={{ fontSize: "2rem", textAlign: "center" }} title="Username">
				{user?.username}
			</h1>
			<p style={{ textAlign: "center" }} title="Email">
				{user.attributes?.email}
				{!user.attributes?.email_verified && (
					<>
						<Modal
							show={verifyIsOpen}
							onHide={() => {
								setVerifyIsOpen(false);
							}}
							dialogClassName={styles.modal}
							backdropClassName={styles.modalBackdrop}
						>
							<Modal.Body>
								<VerifyEmail
									onClose={() => {
										setVerifyIsOpen(false);
									}}
								/>
							</Modal.Body>
						</Modal>
						<InlineError>
							{" "}
							not verified
							<ToolTip tooltip="Resend email verification">
								<ResendEmailButton
									onClick={() => {
										resendEmailVerify(user);
										setVerifyIsOpen(true);
									}}
								>
									<BiRefresh />
								</ResendEmailButton>
							</ToolTip>
						</InlineError>{" "}
					</>
				)}
			</p>
		</>
	);
};

export default AccountDetails;

const ResendEmailButton = styled.button`
	outline: none;
	background: none;
	cursor: pointer;
	box-shadow: none;
	border: none;

	svg {
		fill: #fff;
		height: 21px;
		width: 21px;
	}
`;
