import React from "react";
import { Form, Button } from "react-bootstrap";
import { MdRefresh, MdFormatIndentDecrease, MdOutlineError } from "react-icons/md";
import { FaWindowClose } from "react-icons/fa";
import styled, { keyframes } from "styled-components";
import Colors from "../../../components/themes/Colors";
import MyButton from "./../../../components/Button";

export const StyledNavSidebar = styled.div`
	&&& {
		scrollbar-color: #f0f0f0 rgba(0, 0, 0, 0);
	}

	color: var(--textColor1);
	position: fixed;
	top: 70px;
	height: calc(100vh - 60px);
	background: var(--navigationbarBackground);
	width: 450px;
	border-left: 2px solid #494949;
	padding: 10px;
	scrollbar-width: thin;
	right: 0;
	transition: opacity 200ms, transform 350ms;
	transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
	overflow: ${({ overflow }) => overflow || "auto"};
	scrollbar-color: var(--scrollbarColors) !important;
	z-index: 999;

	@media screen and (max-width: 1920px) {
		width: 300px;
	}

	&.NavSidebarSlideRight-enter,
	&.NavSidebarSlideRight-appear {
		opacity: 0;
		transform: translate3d(450px, 0, 0);
		will-change: transform, opacity;

		@media screen and (max-width: 1920px) {
			transform: translate3d(300px, 0, 0);
		}
	}

	&.NavSidebarSlideRight-enter-active,
	&.NavSidebarSlideRight-appear-active {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}

	&.NavSidebarSlideRight-enter-done {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}

	&.NavSidebarSlideRight-exit {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}

	&.NavSidebarSlideRight-exit-active {
		opacity: 0;
		transform: translate3d(450px, 0, 0);
		transition: opacity 150ms, transform 150ms;

		@media screen and (max-width: 1920px) {
			transform: translate3d(300px, 0, 0);
		}
	}
`;

export const StyledNavSidebarBackdrop = styled.div`
	background: rgba(0, 0, 0, 0.1);
	width: calc(100vw);
	position: fixed;
	left: 0;
	height: 100vh;
	top: 0px;

	&.NavSidebarBackdropFade-enter {
		opacity: 0;
		transform: translate3d(0, 0, 0);
	}

	&.NavSidebarBackdropFade-enter-active {
		opacity: 1;
		transform: translate3d(-450px, 0, 0);
		transition: transform 350ms, opacity 350ms;
		transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);

		@media screen and (max-width: 1920px) {
			transform: translate3d(-300px, 0, 0);
		}
	}

	&.NavSidebarBackdropFade-exit {
		opacity: 1;
		transform: translate3d(-450px, 0, 0);

		@media screen and (max-width: 1920px) {
			transform: translate3d(-300px, 0, 0);
		}
	}

	&.NavSidebarBackdropFade-exit-active {
		opacity: 0;
		transform: translate3d(0, 0, 0);
		transition: transform 150ms, opacity 150ms;
		transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}
`;

export const StyledProfileImg = styled.img`
	width: 100%;
	display: flex;
	margin: auto;
`;

export const StyledToggleSwitch = styled.label`
	display: flex;
	align-items: center;
	cursor: pointer;
	width: max-content;
	padding: ${({ padding }) => `${padding}px 0`};

	span {
		padding-left: 5px;
		font-size: 0, 9rem;
		font-weight: bold;
	}
`;

export const StyledConnectTwitch = styled(Button)`
	background-color: hsla(268, 77%, 30%, 1);
	margin-left: 0;
	border-radius: 10px;

	#disconnect {
		background-color: hsla(268, 77%, 15%, 1);
	}

	&&& {
		border: thin solid hsla(268, 77%, 30%, 1);

		&:hover {
			background-color: hsla(268, 77%, 40%, 1);
			border: inherit;
		}

		&:focus {
			background-color: hsla(268, 77%, 40%, 1);
			box-shadow: 0 0 0 0.2rem hsla(268, 77%, 50%, 1);
		}

		&:active {
			background-color: hsla(268, 77%, 55%, 1);
			border-color: hsla(268, 77%, 65%, 1);
		}
	}
`;

export const StyledConnectYoutube = styled(Button)`
	background-color: hsla(0, 65%, 18%, 1);
	width: max-content;
	margin-left: 0;
	height: 42px;
	border-radius: 10px;
	display: flex;

	&#disconnect {
		background-color: hsla(0, 65%, 10%, 1);
	}

	&&& {
		border: thin solid hsla(0, 65%, 18%, 1);

		&:hover {
			background-color: hsla(0, 65%, 28%, 1);
			border: inherit;
		}

		&:focus {
			background-color: hsla(0, 65%, 28%, 1);
			box-shadow: 0 0 0 0.2rem hsla(0, 65%, 38%, 1);
		}

		&:active {
			background-color: hsla(0, 65%, 40%, 1);
			border-color: hsla(0, 65%, 45%, 1);
		}

		:disabled {
			background-color: hsla(0, 65%, 18%, 1);
		}
	}
`;

export const StyledCreateFormTitle = styled.h3`
	text-align: center;
	border-bottom: 2px solid rgb(163, 163, 163);
	margin: auto;
	margin-top: auto;
	margin-top: auto;
	margin-top: 40px;
	padding-bottom: 0.25rem;
`;

export const StyledCreateForm = styled(Form)`
	margin: auto;
	margin-top: 25px;
`;

export const ShowAddFormBtn = styled(Button).attrs({ variant: "outline-secondary" })`
	position: absolute;
	opacity: 0;
	background: #00000073;
	width: calc(100% - 20px);
	height: calc(380px / 16 * 9);
	transition: opacity 500ms, background 500ms;
	transition-delay: 0.2s;
	border: none;
	color: white;

	&:hover {
		opacity: 1;
		background: #00000073;
	}

	&:active {
		opacity: 1;
		background: #00000073;
	}

	&:focus {
		opacity: 1;
		background: #00000073;
	}
`;

export const StyledSidebarTrigger = styled(MdFormatIndentDecrease).attrs({ size: 32 })`
	&&& {
		display: flex;
	}

	position: absolute;
	border-radius: 50%;
	justify-content: center;
	align-items: center;
	transition: opacity 500ms, transform 350ms;
	color: #ffffff;
	background: #0000003b;
	opacity: 0;
	padding: 2px;
	transform: ${({ open }) => (open ? "rotateY(180deg)" : "unset")};

	&:hover {
		opacity: 1;
	}
`;

export const StyledLogoutContiner = styled.div`
	right: 0;
	width: 100%;
	height: 120px;
	padding: 5px;
	padding-bottom: 10px;
	display: flex;
	gap: 10px;
	display: flex;
	align-items: end;
	justify-content: end;

	button.btn-secondary {
		background-color: #26292b;
		border-radius: 10px;
		border: thin solid #313131;

		&:hover {
			background-color: #434950;
		}
		&:focus {
			box-shadow: 0 0 0 0.2rem #434950;
		}

		&:active {
			background-color: #434950;
			border-color: #434950;
		}
	}

	button[label="logout"] {
		/* margin: auto; */
		width: max-content;
		min-width: 170px;
	}
`;

export const StyledAccountButton = styled(Button)`
	background: ${({ color }) => color || "grey"};
	border-color: grey;
	width: 52px;
	height: 42.5px;
	grid-row: 2;

	i {
		height: 24px;
		display: flex;
		justify-content: center;
		width: 24px;
	}
`;

export const DeleteAccountForm = styled(Form)`
	margin-top: 25px;

	.form-group {
		width: 400px;
		margin: auto;
	}

	label {
		display: flex;
		flex-direction: column;
		text-align: center;
	}

	input[type="submit"],
	button {
		margin: auto;
		display: flex;
		font-size: 22px;
		padding: 10px 25px;
		/* background: #921818;
    border: 2px solid #c80c0c; */
		color: white;
		border-radius: 10px;
		box-shadow: 2px 2px 5px black;
		margin-top: 50px;

		/* :hover {
      background: #c70f0f;
    } */
	}
`;

export const DeleteAccountFooter = styled.div`
	position: absolute;
	bottom: 0;
`;

export const StyledConnectContainer = styled.div`
	margin-bottom: 10px;
	display: grid;
	grid-template-areas: "name disconnect";
	grid-template-columns: min-content;
	color: white;

	button {
		min-width: 200px;
		justify-self: left;
		display: flex;
		align-items: center;
		border-radius: 22px;

		svg {
			margin-right: 10px;
		}
	}

	.username#Twitch {
		background: #240944;
	}
	.username#Youtube {
		background: rgb(42, 9, 9);
	}

	.username {
		grid-area: name;
		display: flex;
		align-items: center;
		border-radius: 22px;
		margin-right: 15px;
		height: 42px;
		min-width: 200px;

		&:hover #reconnectIcon {
			opacity: 1;
		}

		> div {
			width: 50px;
			height: 100%;
			cursor: pointer;
		}

		img {
			border-radius: 50%;
			height: 100%;
			margin-right: 5px;
		}

		p {
			margin: 0;
			align-items: center;
			display: flex;
			justify-content: center;
			padding-right: 15px;
			font-size: 1.1rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	#connect {
		grid-area: name;
	}

	#disconnect {
		grid-area: disconnect;
		color: #b5b5b5;
		border-radius: 50%;
		min-width: 42px;
		width: 42px;

		svg {
			margin-right: 0;
		}

		&:hover {
			color: #ffffff;
		}
	}
`;

export const StyledReconnectIcon = styled(MdRefresh).attrs({ size: 30 })`
	&&& {
		display: flex;
	}

	position: absolute;
	width: 42px;
	height: 42px;
	border: 2px solid #292929;
	border-radius: 80%;
	justify-content: center;
	align-items: center;
	transition: opacity 0.5s;
	color: #ffffffd9;
	background: #0000003b;
	opacity: 0;

	&:hover {
		opacity: 1;
	}
`;

export const CloseAddFormBtn = styled(FaWindowClose).attrs({ size: 26 })`
	color: rgb(225, 225, 255);
	position: absolute;
	margin-left: calc(100% - 46px);
	cursor: pointer;
	z-index: 1;
	transition: color 250ms;

	&:hover {
		color: #ffffff;
	}
`;

export const ProfileImgInput = styled.form`
	border-radius: 5px;
	top: unset;
	background: #00000087;
	border: none;
	box-shadow: 0 5px 10px 3px rgba(0, 0, 0, 0.25);

	position: absolute;
	width: calc(100% - 20px);
	height: calc(380px / 16 * 9);
	padding-top: 8px;

	form {
		padding: 5px;
	}

	label {
		text-align: center;
		width: inherit;
	}

	input[type="text"] {
		color: white;
		border: none;
		border-bottom: 1px solid white;
		background-color: transparent;
		background: transparent;
		width: 100%;
		text-align: center;
		margin: 10px 0;
	}

	input[type="submit"] {
		border-radius: 5px;
		border: thin solid #484848;
		background-color: #035879;
		color: rgb(224, 224, 224);
		width: 100%;
		margin-top: 5px;
		transition: color 250ms, background-color 250ms;

		&:hover {
			color: white;
			background-color: #097099;
		}
	}

	ul {
		list-style: none;
		padding-left: 10px;
		padding-right: 10px;
		background-color: rgb(8, 3, 20);

		li {
			display: flex;
			justify-content: space-between;
			margin-bottom: 10px;
			height: 35px;
			align-items: center;
		}

		li p {
			margin: 0;
		}
	}
`;

export const ProfileImgContainer = styled.div`
	width: 100%;
	max-height: calc(380px / 16 * 9);
`;

export const StyledToggleButton = styled(MyButton)`
	opacity: ${({ enabled }) => (enabled === "true" ? 1 : 0.35)};
	margin: 10px;
	border: none;
	box-shadow: none;
	background: #434950;
	flex-grow: 1;
	max-width: calc(30% - 0.5rem);

	flex-basis: ${({ buttonsperrow }) => (buttonsperrow ? `calc((100% - (20px * ${buttonsperrow})) / ${buttonsperrow})` : "auto")};
	align-self: center;
	display: flex;
	justify-content: center;

	&[disabled="true"] {
		opacity: 0.15;
	}

	&:focus {
		background: #434950;
		box-shadow: unset;
	}

	.smallIcon {
		margin-left: 5px;
		transform: translateY(-3px);
	}

	&:hover {
		background: ${({ enabled }) => (enabled === "true" ? Colors.rgba(Colors.red, 0.75) : Colors.rgba(Colors.green, 0.75))};
	}
`;

export const StyledToggleButtonsContainer = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
`;

export const ToggleButtonsContainer = ({ children, buttonsperrow }) => {
	const childrens = React.Children.map(children, (child) => {
		if (!React.isValidElement(child)) return null;
		return React.cloneElement(child, {
			buttonsperrow: buttonsperrow,
		});
	});

	return <StyledToggleButtonsContainer>{childrens}</StyledToggleButtonsContainer>;
};

export const ToggleButtonsContainerHeader = styled.h5`
	margin-bottom: 0.2rem;
	padding-bottom: 0.3rem;
	text-align: center;
	border-bottom: thin solid rgb(50, 50, 50);
	transition: color 250ms;
	color: rgb(200, 200, 200);
	cursor: pointer;

	svg {
		transition: transform 250ms;
		transform: ${({ expanded }) => (expanded ? "rotate(0deg)" : "rotate(180deg)")};
	}

	&:hover {
		color: rgb(235, 235, 235);
	}
`;

const breathing = keyframes`
    from {
      filter: brightness(1);
    }
    to {
      filter: brightness(1.25);
			}
`;

export const StyledInlineError = styled.div`
	color: ${Colors.red};
	gap: 0.25rem;
	display: flex;
	padding: 0.35rem 0.75rem;
	align-items: center;
	background-color: ${Colors.rgba(Colors.red, 0.1)};
	border-radius: 0.35rem;
	animation: 1.5s infinite alternate ease-out ${breathing};
`;

export const InlineError = ({ children }) => {
	return (
		<StyledInlineError>
			<MdOutlineError size={30} title={children} />
			{children}
		</StyledInlineError>
	);
};
