import React, { useEffect, useState } from "react";
import { Modal as ReactModal } from "react-bootstrap";
import styles from "./Modal.module.scss";
import styled from "styled-components";
import { ScheduleListContainer } from "../../pages/twitch/schedule/StyledComponents";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Modal = React.forwardRef(({ backdrop = false, children, trigger, show, size, height, width, header, ...rest }, ref) => {
	const [isOpen, setIsOpen] = useState();

	const open = () => {
		setIsOpen(true);
	};
	const close = () => {
		setIsOpen(false);
	};

	useEffect(() => {
		setIsOpen(show);
	}, [show]);

	return (
		<>
			{trigger && <div onClick={open}>{trigger}</div>}
			<StyledReactModal
				{...rest}
				ref={ref}
				show={isOpen}
				onHide={close}
				dialogClassName={styles.modal}
				backdropClassName={backdrop ? styles.modalBackdrop : ""}
				size={size || "xl"}
				height={height}
				width={width}
				restoreFocus
			>
				{/* <ReactModal.Header closeButton>{header}</ReactModal.Header> */}
				<ReactModal.Body>{children}</ReactModal.Body>
			</StyledReactModal>
		</>
	);
});
export default Modal;

const StyledReactModal = styled(ReactModal)`
	max-height: 100vh;
	&&& {
		.modal-dialog {
			/* top: calc(40% - (600px / 2)); */
			/* left: calc(50% - (800px / 2)); */
			top: ${({ height }) => `calc(50% - (${height || "600px"} / 2))`};
			left: ${({ width }) => `calc(50% - (${width || "800px"} / 2))`};
			width: ${({ width }) => width || "800px"} !important;
			height: ${({ height }) => height || "600px"} !important;
			max-height: 100vh;
		}
	}
	${ScheduleListContainer} {
		width: 100%;
		height: 100%;
	}
`;
