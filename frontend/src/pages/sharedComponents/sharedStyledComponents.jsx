import { Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import React from "react";
import styled, { keyframes } from "styled-components";
import Moment from "react-moment";
import { MdAddToQueue, MdRemoveFromQueue, MdExpandLess } from "react-icons/md";

import ToolTip from "../../components/tooltip/ToolTip";
import { ButtonLookalikeStyle, TransparentButton } from "../../components/styledComponents";
import { TransparentRemoveFromCurrentListButton } from "../myLists/addToListModal/RemoveFromCurrentListButton";
import Colors from "../../components/themes/Colors";
import { useFeedVideoSizeObject } from "../../stores/feedVideoSize";

export const AddToListModalTrigger = styled(Button).attrs({ variant: "outline-secondary" })`
	${ButtonLookalikeStyle}
	display: flex;
	position: relative;
	font-weight: bold;
	align-items: center;
`;

const ExpandIcon = styled(MdExpandLess)`
	transition: transform 250ms, opacity 250ms;
	transform: ${({ collapsed }) => (collapsed === "true" ? "rotate(0deg)" : "rotate(180deg)")};
	opacity: 0.75;

	&:hover {
		transform: ${({ collapsed }) => (collapsed === "true" ? "rotate(0deg) scale(1.2)" : "rotate(180deg) scale(1.2)")};
		opacity: 1;
	}
`;

export const SubFeedContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	min-height: 400px;
	max-width: 100%;
	overflow: hidden;
`;

export const StyledVideoContainer = styled.div`
	display: grid;
	grid-template-areas:
		"video video"
		"title title"
		"info info";
	grid-template-columns: 100%;

	width: ${({ feedVideoSizeProps }) => feedVideoSizeProps.width}px;
	margin: ${({ feedVideoSizeProps }) => feedVideoSizeProps.margin}px;
	max-height: ${({ feedVideoSizeProps }) => feedVideoSizeProps.width}px;
	margin-bottom: 15px;
	position: relative;
	transition: font-size 750ms, height 750ms, max-height 750ms, margin 750ms, width 750ms;
	font-size: ${({ feedVideoSizeProps }) => feedVideoSizeProps.fontSize}px;

	box-shadow: var(--videoBoxShadow);
	border-radius: 1em;
	background-color: var(--videoContainerBackgroundColor);

	&.videoFadeSlide-appear {
		opacity: 0;
		transition: opacity 750ms, margin-left 750ms, margin-right 750ms;
	}
	&.videoFadeSlide-appear-active {
		opacity: 1;
		transition: opacity 750ms, margin-left 750ms, margin-right 750ms;
	}

	&.videoFadeSlide-enter {
		opacity: 0;
		margin-left: ${({ feedVideoSizeProps }) => -(feedVideoSizeProps.totalWidth - feedVideoSizeProps.margin * 2)}px !important;
		margin-right: 0px !important;
		transition: opacity 500ms, margin-left 750ms, margin-right 750ms;
	}

	&.videoFadeSlide-enter-active {
		opacity: 1;
		margin-left: ${({ feedVideoSizeProps }) => feedVideoSizeProps.margin}px !important;
		margin-right: ${({ feedVideoSizeProps }) => feedVideoSizeProps.margin}px !important;
		transition: opacity 500ms, margin-left 750ms, , margin-right 750ms;
	}

	&.videoFadeSlide-enter-done {
		opacity: 1;
		transition: opacity 500ms, margin-left 750ms, margin-right 750ms;
	}

	&.videoFadeSlide-exit {
		opacity: 1;
		margin-left: ${({ feedVideoSizeProps }) => feedVideoSizeProps.margin}px !important;
		margin-right: ${({ feedVideoSizeProps }) => feedVideoSizeProps.margin}px !important;
		transition: opacity 500ms ease 250ms, margin-left 750ms, margin-right 750ms;
	}

	&.videoFadeSlide-exit-active {
		opacity: 0;
		margin-left: ${({ feedVideoSizeProps }) => -feedVideoSizeProps.totalWidth + feedVideoSizeProps.margin * 2}px !important;
		margin-right: 0px !important;
		transition: opacity 500ms ease 250ms, margin-left 750ms, width 750ms, margin-right 750ms, max-width 750ms, transform 750ms;
	}

	&.verticalSlide-appear {
		opacity: 0;
		transition: opacity 750ms;
	}
	&.verticalSlide-appear-active {
		opacity: 1;
		transition: opacity 750ms;
	}

	&.verticalSlide-enter {
		opacity: 0;
		margin-top: ${({ feedVideoSizeProps }) => -feedVideoSizeProps.totalHeight}px !important;
		margin-bottom: 0px !important;
		transition: opacity 500ms, margin-top 750ms, width 750ms, margin-bottom 750ms, max-width 750ms, transform 750ms;
	}

	&.verticalSlide-enter-active {
		opacity: 1;
		margin-top: ${({ feedVideoSizeProps }) => feedVideoSizeProps.margin}px !important;
		margin-bottom: 15px;
		transition: opacity 500ms, margin-top 750ms, width 750ms, margin-bottom 750ms, max-width 750ms, transform 750ms;
	}

	&.verticalSlide-enter-done {
		opacity: 1;
		transition: opacity 500ms;
	}

	&.verticalSlide-exit {
		opacity: 1;
		margin-top: ${({ feedVideoSizeProps }) => feedVideoSizeProps.margin}px !important;
		margin-bottom: 15px;
		transition: opacity 500ms ease 250ms, margin-top 750ms, width 750ms, margin-bottom 750ms, max-width 750ms, transform 750ms;
	}

	&.verticalSlide-exit-active {
		opacity: 0;
		margin-top: ${({ feedVideoSizeProps }) => -feedVideoSizeProps.totalHeight}px !important;
		margin-bottom: 0px !important;
		transition: opacity 500ms ease 250ms, margin-top 750ms, width 750ms, margin-bottom 750ms, max-width 750ms, transform 750ms;
	}

	a {
		&&& {
			font-size: 1em;
		}

		.game {
			color: var(--textColor2);
		}

		&:hover {
			color: var(--textColor2Hover);
		}
	}

	&:hover {
		${TransparentRemoveFromCurrentListButton} {
			opacity: 1;
		}
	}
`;

export const VideoContainer = React.forwardRef(({ children, ...props }, ref) => {
	const feedVideoSizeProps = useFeedVideoSizeObject();

	return (
		<StyledVideoContainer feedVideoSizeProps={feedVideoSizeProps} {...props} ref={ref}>
			{children}
		</StyledVideoContainer>
	);
});

export const ImageContainer = React.forwardRef(({ children, active }, ref) => {
	const feedVideoSizeProps = useFeedVideoSizeObject();

	return (
		<StyledImageContainer feedVideoSizeProps={feedVideoSizeProps} active={active} ref={ref}>
			{children}
		</StyledImageContainer>
	);
});

export const ChannelContainer = styled.div`
	display: grid;
	height: 1.625em;
	align-content: center;
	margin-bottom: 5px;
	grid-template-columns: min-content;
	width: inherit;
	/* overflow: hidden; */
	font-size: 1em;
	z-index: 1;
	position: relative;

	.profileImg {
		grid-row: 1;
		padding-right: 5px;

		img {
			width: 1.625em;
			border-radius: 3px;
		}
	}

	.channelName {
		padding: 0 5px;
		font-weight: bold;
		color: var(--textColor2);
		grid-row: 1;
		width: max-content;
		transition: color 250ms;
		align-items: center;
	}

	.buttonsContainer {
		display: flex;
		grid-row: 1;
		justify-content: right;
		transition: transform 350ms, opacity 150ms ease-in-out 0ms;
		transform: translateY(50%);
		opacity: 0;
		pointer-events: none;
	}

	&:hover,
	&:focus-within {
		.buttonsContainer {
			transform: translateY(0px);
			opacity: 1;
			pointer-events: all;

			button,
			svg {
				opacity: 1;
			}
			transition: transform 350ms, opacity 250ms ease-in-out 100ms;
		}
	}

	a {
		display: flex;
		align-items: center;
	}
`;

export const StyledGameContainer = styled.div`
	display: grid;
	grid-template-columns: 10% auto;
	width: ${({ feedVideoSizeProps }) => feedVideoSizeProps.width}px;
	transition: width 750ms;
	align-items: center;
	/* min-height: 34px; */
	transition: color 250ms, width 750ms;
	font-size: 1em;

	.gameImg {
		width: 1.625em;
		border-radius: 3px;
		grid-column: 1;
		object-fit: cover;
		padding: 0;

		img {
			width: 100%;
			border-radius: inherit;
		}
	}

	.gameName {
		padding-left: 5px;
		grid-column: 2;
		bottom: 20px;
		background: none;
		padding-right: 5px;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		transition: color 250ms;
		color: var(--textColor2);
	}

	.viewers {
		color: var(--textColor2);
		position: relative;
		display: flex;
		justify-content: flex-end;
		grid-column: 3;
		padding-right: 10px;
		margin-bottom: 0;
		align-items: center;

		svg {
			color: rgb(200, 200, 200);
			margin-left: 5px;
			display: flex;
			align-items: center;
		}
	}
`;

export const GameContainer = ({ children }) => {
	const feedVideoSizeProps = useFeedVideoSizeObject();

	return <StyledGameContainer feedVideoSizeProps={feedVideoSizeProps}>{children}</StyledGameContainer>;
};

export const GamenameAndViewers = styled.div`
	display: flex;
	justify-content: space-between;
	overflow: hidden;
	grid-column: 2;
`;

export const VideoTitle = styled(Link)`
	color: var(--textColor1);
	/* margin-top: 15px;
  margin-bottom: 5px;  */
	grid-area: title;
	font-size: 1.1em;
	max-width: 100%;
	overflow: hidden;
	/* height: 45px; */
	line-height: 1.2;
	padding: 0;
	transition: color 200ms;
	margin-top: 0.85em;
	margin-bottom: 0.3em;
	height: 2.5em;

	&:hover {
		color: var(--textColor1Hover);
		mix-blend-mode: unset;
	}
`;

// YoutubeVideoElement title
export const VideoTitleHref = styled.a`
	color: ${({ error }) => (error ? Colors.red : "var(--textColor1)")};
	grid-area: title;
	font-size: 1.1em;
	max-width: 100%;
	overflow: hidden;
	line-height: 1.2;
	padding: 0;
	transition: color 200ms;
	margin-top: 0.85em;
	margin-bottom: 0.3em;
	height: 2.5em;

	&:hover {
		color: var(--textColor1Hover);
		mix-blend-mode: unset;
	}
`;

export const TopRightBtnWrapper = styled.div`
	opacity: 0;
	position: absolute;
	top: 0px;
	right: 5px;
	z-index: 1;
	padding: 5px;
	color: rgb(150, 150, 150);
	display: flex;
	gap: 0.5rem;
	align-items: center;

	&:hover {
		&&& {
			transition: color 250ms ease-in 0ms, opacity 250ms ease-in 0ms;
			color: rgb(200, 200, 200);
			opacity: 1;
		}
	}
`;

export const LatestVodBtn = styled.a`
	transition: all 250ms ease-in 0ms;
	color: inherit;

	&:hover {
		color: rgb(255, 255, 255);
	}
`;

export const OpenInNewTab = styled.a`
	transition: all 250ms ease-in 0ms;
	color: inherit;

	&:hover {
		color: rgb(255, 255, 255);
	}
`;

export const StyledImageContainer = styled.div`
	grid-area: video;
	height: ${({ feedVideoSizeProps }) => (feedVideoSizeProps.width / 16) * 9}px;
	width: 100%;
	position: relative;
	background-size: cover;
	background-position: center;
	border-radius: 10px;
	transition: transform 200ms, box-shadow 200ms, font-size 750ms, height 750ms, margin 750ms, width 750ms;

	a {
		display: block;

		&.imgLink {
			height: 100%;
			color: var(--textColor2);
		}
	}

	//fallback if img src is invalid
	background-image: url(${process.env.PUBLIC_URL + "/images/webp/placeholder.webp"});

	img {
		border-radius: 10px;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: width 750ms;
	}

	&::after {
		content: "Playing";
		position: absolute;
		top: 0;
		padding: 3px 5px;
		border-radius: 10px;
		background: ${Colors.red} none repeat scroll 0% 0%;
		font-size: 0.8em;
		transform: translate3d(-30%, -30%, 0);
		display: ${({ active }) => (active ? "unset" : "none")};
	}

	&:hover {
		z-index: 2;
		transform: scale(1.15);
		box-shadow: 0 0px 0px 0px #be0e0e00, 0 0px 0px 0px #be0e0e00, 6px 0 25px -2px rgba(0, 0, 0, 0.5), -6px 0 25px -2px rgba(0, 0, 0, 0.5);

		.error {
			opacity: 1;
		}

		time {
			z-index: 1;
		}

		.listVideoButton {
			opacity: 1;
		}

		${TopRightBtnWrapper} {
			transition: opacity 250ms ease-in 250ms, color 250ms ease-in 0ms;
			opacity: 0.9;
			color: rgb(225, 225, 225);
		}
	}
`;

export const UnfollowButton = styled(Button).attrs({ variant: "link" })`
	color: rgba(109, 2, 2, 0.801);
	grid-row: 1;
	justify-self: right;
	width: 36px;
	padding-left: 0;
	padding: 2px;

	&:hover {
		color: rgba(203, 14, 14, 0.8);
	}
`;

export const VodAddRemoveButton = styled(Button)`
	color: rgb(200, 200, 200);
	grid-row: 1;
	justify-self: right;
	padding: ${({ padding }) => padding || "0px"};
	opacity: ${({ loweropacity }) => loweropacity || 1};
	margin-right: ${({ marginright }) => marginright || "unset"};
	/* opacity: 0; */
	transition: opacity 250ms, background 250ms, color 250ms, transform 250ms;
	z-index: 2;

	svg {
		fill: ${({ vodenabled }) => (vodenabled === "true" ? Colors.green : "rgb(200,200,200)")};
	}

	&&& {
		&:hover {
			color: ${({ vodenabled, variant }) => (variant === "success" ? "unset" : vodenabled === "true" ? Colors.red : Colors.green)};
			opacity: 1;

			svg {
				fill: ${({ vodenabled }) => (vodenabled === "true" ? Colors.red : Colors.green)};
			}
		}
	}
`;

export const ImgBottomInfo = styled.div`
	bottom: 2.2em;
	position: relative;
	display: flex;
	justify-content: space-between;
	font-size: 0.9em;
	align-items: center;
	height: 2em;
	margin: 0px 0.2em 0px 0.2em;

	> * {
		position: relative;
		width: max-content;
		/* font-size: 0.9em; */
		z-index: 1;
		background: rgba(22, 22, 22, 0.69);
		align-items: center;
		display: flex;
		border-radius: 1em;
		padding: 0.2em 0.5em;

		/* bottom: 2.2em; */
		/* height: 2em; */
	}

	.view_count svg {
		color: var(--textColor2);
		margin-left: 5px;
		margin-top: 3px;
		display: flex;
		align-items: center;
	}
`;

export const StyledVideoElementAlert = styled(Alert)`
	text-align: center;
	padding: 2px;
	position: absolute;
	width: 100%;
	border-radius: 10px 10px 0 0;
	transition: opacity 250ms;
	opacity: 0;
`;

export const LastRefreshText = styled(Moment).attrs({ fromNow: true, interval: 60000 })`
	position: relative;
	color: var(--textColor2);
`;

export const AddToQueueButton = styled(MdAddToQueue)`
	position: absolute;
	top: 5px;
	left: 5px;

	cursor: pointer;
	opacity: ${({ enabled }) => (enabled === "true" ? "1" : "0.5")};
	transition: opacity 250ms;

	&:hover {
		opacity: ${({ enabled }) => (enabled === "true" ? "1" : "0.7")};
	}
`;
export const RemoveFromQueueButton = styled(MdRemoveFromQueue)`
	position: absolute;
	top: 5px;
	left: 5px;
	cursor: pointer;
	opacity: ${({ enabled }) => (enabled === "true" ? "1" : "0.5")};
	transition: opacity 250ms;

	&:hover {
		opacity: ${({ enabled }) => (enabled === "true" ? "1" : "0.7")};
	}
`;

export const PositionInQueue = styled.div`
	position: absolute;
	top: 5px;
	left: 35px;
`;

export const ExpandCollapseFeedButton = (props) => {
	return (
		<ToolTip tooltip={`${props.collapsed ? "Expand" : "Collapse"} feed`}>
			<TransparentButton {...props}>
				<ExpandIcon size={24} color="white" collapsed={String(props.collapsed)} />
			</TransparentButton>
		</ToolTip>
	);
};

const heartBeatAnimation = keyframes`
  0% {
    transform: scale(0);


    opacity: 0;
  }
  25% {
    transform: scale(0.1);


    opacity: 0.1;
  }
  50% {
    transform: scale(0.5);


    opacity: 0.3;
  }
  75% {
    transform: scale(0.8);


    opacity: 0.5;
  }
  to {
    transform: scale(1);


    opacity: 0;
  }
`;

export const StyledNewlyAddedIndicatorPulseRings = styled.div`
	animation: ${heartBeatAnimation} 1s ease-out;
	animation-iteration-count: infinite;
	z-index: 10;
	border: 10px solid ${Colors.red};
	border-radius: 0.35em;
	height: calc(100% + 30px);
	width: calc(100% + 30px);
	position: absolute;
	padding: 15px;
`;

export const StyledNewlyAddedIndicator = styled.div`
	color: rgb(255, 255, 255);
	padding: 0.15rem 0.3rem;
	font-weight: 700;
	font-size: 1em;
	background: ${Colors.rgba(Colors.red, 0.9)};
	border-radius: 0.25em;
`;
export const StyledNewlyAddedIndicatorWrapper = styled.div`
	position: absolute;
	top: 5px;
	left: 5px;
	pointer-events: none;

	* {
		pointer-events: none;
	}
`;

export const RelativeContainer = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
`;
