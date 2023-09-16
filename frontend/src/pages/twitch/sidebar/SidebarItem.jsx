import { CSSTransition } from "react-transition-group";
import { FaRegClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import React, { useState, useRef } from "react";
import styled from "styled-components";

import { SidebarInfoPopup, StyledsidebarItem, FirstRow, SecondRow } from "./StyledComponents";
import { truncate } from "../../../utilities";
import AnimatedViewCount from "../live/AnimatedViewCount";
import LiveInfoPopup from "../channelList/LiveInfoPopup";
import useEventListenerMemo from "../../../hooks/useEventListenerMemo";
import loginNameFormat from "./../loginNameFormat";
import ToolTip from "../../../components/tooltip/ToolTip";
import FavoriteStreamBtn from "../live/FavoriteStreamBtn";
import { VodAddRemoveButton } from "../../sharedComponents/sharedStyledComponents";

const StyledNewHighlight = styled.div`
	position: absolute;
	left: 0;
	height: 62px;
	width: 4px;
	border-radius: 2px;
	background: var(--newHighlightColor);
`;

const SidebarItemkWrapper = styled.div`
	position: relative;

	&:hover {
		${VodAddRemoveButton} {
			opacity: 0.3;
		}
	}
`;

const SidebarLinkWrapper = styled(Link)`
	display: flex;
	flex-direction: column;

	&.sidebarVideoFade-1s-enter {
		opacity: 0;
		transform: translate3d(0, -62px, 0);
		height: 0px;
		transition: opacity 1000ms, transform 1000ms, height 1000ms;
	}

	&.sidebarVideoFade-1s-enter-active {
		opacity: 1;
		transform: translate3d(0, 0, 0);
		height: 62px;
		transition: opacity 1000ms, transform 1000ms, height 1000ms;
	}

	&.sidebarVideoFade-1s-exit {
		opacity: 1;
		transform: translate3d(0, 0, 0);
		height: 62px;
		transition: opacity 1000ms, transform 1000ms, height 1000ms;
	}

	&.sidebarVideoFade-1s-exit-active {
		opacity: 0;
		transform: translate3d(0, -62px, 0);
		height: 0px;
		transition: opacity 1000ms, transform 1000ms, height 1000ms;
	}
`;

const NewHighlight = ({ newlyAdded, user_name }) => {
	if (newlyAdded?.includes(user_name)) {
		return <StyledNewHighlight />;
	} else {
		return "";
	}
};

const SidebarItem = React.memo(({ stream, newlyAdded, shows, setShows, resetShowsTimer, favorited }) => {
	const { user_name, user_id, profile_image_url, viewer_count, game_name, started_at, title } = stream;
	const [showTitle, setShowTitle] = useState();
	const ref = useRef();
	const timerRef = useRef();

	useEventListenerMemo("mouseenter", handleMouseOver, ref.current);
	useEventListenerMemo("mouseleave", handleMouseOut, ref.current);

	function handleMouseOver() {
		setShowTitle(shows);
		timerRef.current = setTimeout(() => {
			setShowTitle(true);
			setShows(true);
		}, 1000);
	}

	function handleMouseOut() {
		clearTimeout(timerRef.current);
		setShowTitle(false);
		clearTimeout(resetShowsTimer.current);
		resetShowsTimer.current = setTimeout(() => {
			setShows(false);
		}, 5000);
	}

	return (
		<SidebarItemkWrapper>
			<FavoriteStreamBtn
				channel={user_name}
				id={user_id}
				size={20}
				loweropacity={!favorited ? "0" : "0.3"}
				style={{ position: "absolute", top: "0px", left: "0px" }}
			/>

			<SidebarLinkWrapper ref={ref} to={"/" + user_name?.toLowerCase()} key={user_id} duration={String(shows)}>
				<StyledsidebarItem key={user_id} duration={shows}>
					<NewHighlight newlyAdded={newlyAdded} user_name={user_name}></NewHighlight>

					<div className={"profileImage"}>
						<img
							src={profile_image_url?.replace("{width}", 640)?.replace("{height}", 360) || `${process.env.PUBLIC_URL}/android-chrome-192x192.png`}
							alt=""
						></img>
					</div>
					<FirstRow>
						<div className={"sidebarUser"}>{truncate(loginNameFormat(stream), 16)}</div>

						<AnimatedViewCount className={"sidebarViewers"} viewers={viewer_count} disabePrefix={true} />
					</FirstRow>
					<SecondRow>
						<ToolTip show={game_name?.length > 15} delay={{ show: 500, hide: 0 }} tooltip={game_name}>
							<p className={"sidebarGame"}>{game_name}</p>
						</ToolTip>
						<div className={"sidebarDuration"}>
							<Moment interval={1} durationFromNow>
								{started_at}
							</Moment>
							<FaRegClock size={12} />
						</div>
					</SecondRow>
				</StyledsidebarItem>
				<CSSTransition in={showTitle} key={user_id + title} timeout={300} classNames="sidebarInfoPopup" unmountOnExit>
					<SidebarInfoPopup>
						<div className="borderTop"></div>
						<LiveInfoPopup channel={stream} />
						<div className="borderBottom"></div>
					</SidebarInfoPopup>
				</CSSTransition>
			</SidebarLinkWrapper>
		</SidebarItemkWrapper>
	);
});

export default SidebarItem;
