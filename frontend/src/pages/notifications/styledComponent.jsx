import styled, { css } from "styled-components";
import Colors from "../../components/themes/Colors";

export const NotificationListContainer = styled.div`
	max-height: 600px;
	width: 400px;
	margin-top: 20px;
	margin-right: 7px;
	ul {
		padding: 0;
	}
`;

export const UnseenNotifcationCount = styled.div`
	background-color: ${Colors.red};
	height: 20px;
	width: 20px;
	border-radius: 50%;
	position: absolute;
	top: 0;
	left: 0;

	line-height: 24px;
	text-align: center;
	color: #ffffff;
	font-size: 0.8rem;

	display: flex;
	justify-content: center;
	align-items: center;

	transform: translate(-50%, 0);
`;

export const StyledDate = styled.div`
	/* color: ${({ status }) => (status === "Offline" ? "#ffffff" : "#838181")}; */
	color: #838181;
	font-size: 0.85rem;
	text-align: right;
	margin: 0;
	/* grid-row: 3; */
	/* justify-self: right; */
	display: flex;
	justify-content: end;
	position: absolute;
	right: 5px;
	bottom: 5px;

	p {
		margin: 0;
	}

	& > div {
		height: 20px;
		position: relative;
		min-width: 150px;

		* {
			position: absolute;
			top: 0;
			right: 0;
			transition: opacity 250ms;
		}
	}

	& > div:hover {
		#timeago {
			/* display: none; */
			opacity: 0;
		}

		#time {
			/* display: inline; */
			opacity: 1;
		}
	}

	#time {
		/* display: none; */
		opacity: 0;
	}
`;

export const NotificationBoxStyle = css`
	display: flex;
	flex-direction: row;
	box-shadow: rgba(0, 0, 0, 0.25) 4px 8px 15px;
	transition: box-shadow 250ms, filter 250ms;
	padding: 10px;
	background: var(--navigationbarBackground);
	border-radius: 10px;
	margin-bottom: 10px;
	filter: brightness(85%);
	position: relative;
	min-width: 400px;
	width: 100%;

	&:hover {
		box-shadow: rgba(0, 0, 0, 0.5) 4px 8px 15px;
		filter: brightness(100%);
	}
`;

export const StyledClearAllNotifications = styled.button`
	${NotificationBoxStyle};
	cursor: pointer;
	font-weight: bold;
	justify-content: center;
	border: none;
	color: #ffffff;
	filter: brightness(50%) contrast(95%);
`;

export const NotificationText = styled.div`
	flex-grow: 1;
	padding-bottom: 15px;

	a {
		color: #ffffff;
	}
`;
export const NotificationIcon = styled.div`
	padding-right: 10px;
	display: flex;
	align-items: center;
	width: ${({ width }) => width};
	min-width: ${({ width }) => width};
	max-width: ${({ width }) => width};

	&,
	img {
		background-size: contain;
		max-width: 100%;
		max-height: 100%;
	}
`;

export const StyledNotificationItem = styled.li`
	${NotificationBoxStyle}

	cursor: ${({ onClick }) => (onClick ? "pointer" : "initial")};

	h1 {
		font-size: 1em;
	}

	span {
		font-size: 0.9em;
		opacity: 0.85;
		padding-bottom: 25px;
	}

	&:hover {
		box-shadow: rgba(0, 0, 0, 0.5) 4px 8px 15px;
		opacity: 1;
	}
`;
