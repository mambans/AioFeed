import React, { useEffect, useRef, useState } from "react";
import useEventListenerMemo from "../../hooks/useEventListenerMemo";
import { StyledVolumeEventOverlay } from "./player/StyledComponents";
import toggleFullscreenFunc from "./player/toggleFullscreenFunc";
import { CSSTransition } from "react-transition-group";
import throttle from "lodash/throttle";
import VolumeSlider from "./player/VolumeSlider";
import PlayPauseButton from "./player/PlayPauseButton";
import ShowStatsButtons from "./player/ShowStatsButtons";
import ShowSetQualityButtons from "./player/ShowSetQualityButtons";
// import Schedule from './schedule';
import ContextMenuWrapper from "./player/ContextMenuWrapper";

const VolumeEventOverlay = React.forwardRef(
	(
		{
			children,
			show,
			type,
			id,
			hidechat,
			vodVolumeOverlayEnabled,
			chatwidth,
			showcursor,
			VolumeEventOverlayRef,
			player,
			videoElementRef,
			style,
			showVolumeSlider,
			addEventListeners = false,
			centerBotttom,
			contextMenuChildren,
			ContextMenu,
			chatAsOverlay,
			hidePointerEvents,
			isFullscreen,
			enabled,
		},
		ref
	) => {
		const [showControlls, setShowControlls] = useState();
		const fadeTimer = useRef();

		useEventListenerMemo("keydown", keyboardEvents, VolumeEventOverlayRef.current, addEventListeners && window?.Twitch?.Player?.READY);
		useEventListenerMemo("dblclick", toggleFullScreen, VolumeEventOverlayRef.current, addEventListeners);

		const showAndResetTimer = throttle(
			() => {
				setShowControlls(true);
				clearTimeout(fadeTimer.current);

				fadeTimer.current = setTimeout(() => setShowControlls(false), 1250);
			},
			150,
			{ leading: true, trailing: false }
		);

		useEventListenerMemo("mousemove", showAndResetTimer, VolumeEventOverlayRef.current, addEventListeners);
		useEventListenerMemo("mousedown", showAndResetTimer, VolumeEventOverlayRef.current, addEventListeners);
		useEventListenerMemo("touchmove", showAndResetTimer, VolumeEventOverlayRef.current, addEventListeners);

		useEventListenerMemo("mouseleave", showAndResetTimer, VolumeEventOverlayRef.current, addEventListeners);

		function keyboardEvents(e) {
			switch (e.key) {
				case "f":
				case "F":
					toggleFullScreen(e);
					break;
				case "q":
				case "Q":
					e.preventDefault();
					player.current?.setQuality("chunked");
					break;
				default:
					break;
			}
		}

		function toggleFullScreen(event) {
			toggleFullscreenFunc({
				event,
				videoElementRef,
			});
		}

		useEffect(() => {
			return () => {
				clearTimeout(fadeTimer.current);
			};
		}, []);

		return (
			<CSSTransition in={show && showControlls} key={"controllsUI"} timeout={show && showControlls ? 500 : 250} classNames="fade-controllUI">
				<StyledVolumeEventOverlay
					style={style}
					ref={ref}
					show={show}
					type={type}
					id={id}
					hidechat={hidechat}
					chatAsOverlay={chatAsOverlay}
					vodVolumeOverlayEnabled={vodVolumeOverlayEnabled}
					chatwidth={chatwidth}
					showcursor={showcursor}
					centerBotttom={centerBotttom}
					hidePointerEvents={hidePointerEvents}
					isFullscreen={String(isFullscreen)}
					enabled={enabled}
				>
					{ContextMenu ||
						(contextMenuChildren && (
							<ContextMenuWrapper outerContainer={VolumeEventOverlayRef.current} showAndResetTimer={showAndResetTimer} includeMarginTop={true}>
								{contextMenuChildren}
							</ContextMenuWrapper>
						))}

					{showVolumeSlider && player.current && (
						<>
							<PlayPauseButton TwitchPlayer={player.current} PlayerUIControlls={VolumeEventOverlayRef.current} />
							<VolumeSlider
								// OpenedDate={OpenedDate}
								PlayerUIControlls={VolumeEventOverlayRef.current}
								TwitchPlayer={player.current}
								setShowControlls={setShowControlls}
								showAndResetTimer={showAndResetTimer}
							/>
							<ShowStatsButtons TwitchPlayer={player.current} />
							<ShowSetQualityButtons TwitchPlayer={player.current} />
						</>
					)}
					{children}
				</StyledVolumeEventOverlay>
			</CSSTransition>
		);
	}
);
export default VolumeEventOverlay;
