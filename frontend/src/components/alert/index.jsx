import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import { FiAlertCircle } from "react-icons/fi";
import { MdOutlineDangerous } from "react-icons/md";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import Colors from "../themes/Colors";

const getType = (type) => {
	switch (type) {
		case "success":
			return { bg: Colors.green, icon: <IoCheckmarkCircleOutline /> };
		case "danger":
		case "error":
			return { bg: Colors.red, icon: <MdOutlineDangerous /> };
		case "warning":
			return { bg: Colors.yellow, icon: <FiAlertCircle /> };
		case "info":
			return { bg: Colors.blue, icon: <FiAlertCircle /> };
		case "white":
		case "light":
			return { bg: "rgb(240,240,240)", icon: <FiAlertCircle /> };
		case "secondary":
		default:
			return { bg: "rgb(112, 112, 112)", icon: <FiAlertCircle /> };
	}
};

const Alert = ({
	icon,
	title = "Oh-oh! Something happened",
	message = "An error occured",
	onClick,
	width,
	center = true,
	type = "default",
	dismissable,
	open,
	show,
	fill,
	style = {},
	actions,
	onClose,
	data,
}) => {
	const [isOpen, setIsOpen] = useState(open ?? show ?? true);
	if (data) {
		console.log("data:", data);
	}

	const alertType = getType(type);

	const handleClose = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsOpen(false);

		onClose?.();
	};

	useEffect(() => {
		setIsOpen(show ?? open ?? true);
	}, [show, open]);

	if (!isOpen) return null;

	return (
		<Wrapper width={width || (fill ? "100%" : null)} onClick={onClick} center={center} type={alertType} style={style}>
			<Background />
			{dismissable && (
				<Close onClick={handleClose}>
					<IoMdClose />
				</Close>
			)}
			<InnerWrapper>
				<IconWrapper>{icon || alertType.icon}</IconWrapper>
				{(typeof title === "string" || React.isValidElement(title)) && <Title>{title}</Title>}
				{(typeof message === "string" || React.isValidElement(message)) && <Message>{message}</Message>}
				<ActionsWrapper
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					{actions}
				</ActionsWrapper>
			</InnerWrapper>
		</Wrapper>
	);
};
export default Alert;

const ICON_WIDTH = "3em";

const Background = styled.div`
	position: absolute;
	inset: 0;
	border-radius: 0 0 0.5rem 0.5rem;
	filter: blur(0px) saturate(0.5);
`;

const Title = styled.h1`
	margin: 0;
	font-size: 2em;
	line-height: 2em;
	font-weight: 600;
	filter: brightness(1.5) saturate(1.25);
`;
const Message = styled.p`
	margin: 0;
	white-space: pre-line;
	line-height: 0.95em;
	font-size: 0.95em;
`;

const Wrapper = styled.div.attrs({ className: "Alert" })`
	font-size: 1rem;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	border-radius: 0 0 0.5rem 0.5rem;
	backdrop-filter: blur(5px);
	width: ${({ width }) => width || "max-content"};
	padding: 0 1rem 1rem calc(1rem + ${ICON_WIDTH});
	cursor: ${({ onClick }) => (onClick ? "pointer" : "initial")};
	transition: filter 250ms, border 250ms;
	margin: ${({ center }) => (center ? "auto" : 0)};
	border-top: 4px solid ${({ type }) => type.bg};

	${Background} {
		background: ${({ type }) => Colors.rgba(type.bg, 0.5)};
	}

	${Title} {
		color: ${({ type }) => type.bg};
	}

	&:hover {
		filter: brightness(1.25);
		border-top: 8px solid ${({ type }) => type.bg};
	}
`;

const IconWrapper = styled.div`
	position: absolute;
	left: 0;
	transform: translateX(-100%);
	padding-right: 10px;
	height: 100%;
	align-items: center;
	display: flex;
	width: ${ICON_WIDTH};

	svg {
		width: ${ICON_WIDTH};
		height: ${ICON_WIDTH};
	}
`;

const InnerWrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	padding: 0 0.5rem;
`;

const Close = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	transform: translate(50%, -50%);
	z-index: 1;
	box-shadow: 0px 2px 2px 1px #0000008a;

	height: 24px;
	width: 24px;
	transition: filter 150ms, height 150ms, width 150ms;
	background: #ffffff;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;

	svg {
		fill: red;
		height: 18px;
		width: 18px;
	}

	&:hover {
		filter: brightness(1.5);
	}
`;

const ActionsWrapper = styled.div`
	display: flex;
	padding-top: 1rem;
`;
