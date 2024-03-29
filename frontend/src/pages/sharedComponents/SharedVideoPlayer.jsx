import { FaList } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useContext, useState, useCallback, useRef, useEffect } from "react";

import {
	VideoAndChatContainer,
	StyledShowNavbarBtn,
	ResizeDevider,
	// VolumeEventOverlay,
} from "../twitch/player/StyledComponents";
import AddToListButton from "../myLists/addToListModal/AddToListButton";
import useQuery from "../../hooks/useQuery";
import PlaylistInPlayer from "../myLists/PlaylistInPlayer";
import YoutubeVideoPlayer from "../youtube/YoutubeVideoPlayer";
import VideoPlayer from "../twitch/player/VideoPlayer";
import useFullscreen from "../../hooks/useFullscreen";
import MyListsContext from "../myLists/MyListsContext";
import autoPlayNextFunc from "../myLists/autoPlayNext";
import useLocalStorageState from "../../hooks/useLocalStorageState";
import VolumeEventOverlay from "../twitch/VolumeEventOverlay";
import { TwitchContext } from "../twitch/useToken";
import { parseNumberAndString } from "../myLists/dragDropUtils";
import PlayerButtonsBar from "../twitch/player/PlayerButtonsBar";
import { useNavigationBarVisible } from "../../stores/navigation";

const DEFAULT_LIST_WIDTH = Math.max(window.innerWidth * 0.1, 400);

const SharedVideoPlayer = () => {
	const urlListName = useQuery().get("list");

	const location = useLocation();
	const { videoId } = useParams() || {};
	const channelName = useParams()?.channelName;
	const navigationBarVisible = useNavigationBarVisible();

	const { enableVodVolumeOverlay } = useContext(TwitchContext) || {};
	const { lists } = useContext(MyListsContext) || {};
	const [listToShow, setListToShow] = useState();
	const [status, setStatus] = useState();

	const [viewStates, setViewStates] = useLocalStorageState(`${listToShow?.title || "empty"}-viewStates`, {
		listWidth: DEFAULT_LIST_WIDTH,
		hideList: true,
		default: true,
	});

	const [resizeActive, setResizeActive] = useState(false);
	const [listVideos, setListVideos] = useState();
	const [autoPlayNext, setAutoPlayNext] = useLocalStorageState("autoPlayNext");
	const [loopList, setLoopList] = useLocalStorageState("loopList");
	const [autoPlayRandom, setAutoPlayRandom] = useLocalStorageState("autoPlayRandom");
	const navigate = useNavigate();

	const domain = location.pathname.split("/")[1];
	const VolumeEventOverlayRef = useRef();
	const [isPlaying, setIsPlaying] = useState();
	const childPlayer = useRef();
	const videoElementRef = useRef();
	const [playQueue, setPlayQueue] = useState([]);
	const [isFullscreen, setIsFullscreen] = useState();

	const toggleShowList = useCallback(
		({ show, updateLocalstorage }) => {
			setViewStates((curr) => {
				delete curr?.default;

				return { ...curr, hideList: show || !curr.hideList };
			}, updateLocalstorage);
		},
		[setViewStates]
	);

	useEffect(() => {
		if (lists) {
			const list = (() => {
				const listFromListname = Object.values(lists).find((list) => list?.title?.toLowerCase() === urlListName?.toLowerCase());

				if (listFromListname) return listFromListname;
				if (!listFromListname) {
					return Object.values(lists).find((list) => list?.videos.includes(parseNumberAndString(videoId)));
				}
			})();

			if (list?.title) {
				window.history.pushState({}, document.title, `${window.location.origin + window.location.pathname}?list=${list?.title}`);
				setListToShow(list);
			}
		}
	}, [videoId, urlListName, lists]);

	useFullscreen();

	const handleResizeMouseDown = () => setResizeActive(true);
	const handleResizeMouseUp = (e) => setResizeActive(false);
	const resize = useCallback(
		(e) => {
			if (resizeActive) {
				const mouseX = e.clientX;

				const newWidth = Math.min(Math.max(parseInt(window.innerWidth - mouseX), 10), window.innerWidth - 250);

				setViewStates((curr) => {
					delete curr?.default;
					return { ...curr, listWidth: newWidth };
				});
			}
		},
		[resizeActive, setViewStates]
	);

	const playNext = () => {
		const nextVideoUrl = autoPlayNextFunc({
			listVideos,
			videoId,
			listToShow,
			autoPlayNext,
			loopList,
			autoPlayRandom,
			playQueue,
			setPlayQueue,
		});
		if (nextVideoUrl) navigate(nextVideoUrl);
	};
	console.log("domain:", domain);

	return (
		<>
			<VideoAndChatContainer
				id="twitch-embed"
				ref={videoElementRef}
				visible={navigationBarVisible}
				chatwidth={viewStates?.listWidth || DEFAULT_LIST_WIDTH}
				resizeActive={resizeActive}
				hidechat={viewStates?.hideList || isFullscreen}
				onMouseUp={handleResizeMouseUp}
				onMouseMove={resize}
			>
				<VolumeEventOverlay
					ref={VolumeEventOverlayRef}
					// show={resizeActive || (enableVodVolumeOverlay && isPlaying)}
					show={resizeActive || enableVodVolumeOverlay}
					type="live"
					id="controls"
					hidechat={String(viewStates?.hideList)}
					enabled={enableVodVolumeOverlay}
					vodVolumeOverlayEnabled={enableVodVolumeOverlay}
					chatwidth={viewStates?.listWidth || DEFAULT_LIST_WIDTH}
					showcursor={enableVodVolumeOverlay && isPlaying}
					isPlaying={isPlaying}
					resizeActive={resizeActive}
					listName={urlListName}
					DEFAULT_LIST_WIDTH={DEFAULT_LIST_WIDTH}
					VolumeEventOverlayRef={VolumeEventOverlayRef}
					player={childPlayer}
					videoElementRef={videoElementRef}
					channelName={channelName}
					showVolumeSlider
					addEventListeners
					centerBotttom
					hidePointerEvents={status === "blocked" || domain === "youtube"}

					// contextMenuChildren={<></>}
				>
					<PlayerButtonsBar
						style={{ margin: "1rem", position: "absolute", right: 0, top: 0, zIndex: 2 }}
						videoId={videoId}
						user={{
							user_name: channelName,
						}}
						schedule={true}
					>
						<AddToListButton
							videoId_p={videoId}
							style={{
								right: "10px",
								top: "50px",
								// opacity: '1',
							}}
							size={32}
							redirect
						/>

						{lists && (
							<StyledShowNavbarBtn variant="dark" onClick={() => toggleShowList({ updateLocalstorage: Boolean(listToShow) })}>
								<FaList
									style={{
										transform: navigationBarVisible ? "rotateX(180deg)" : "unset",
										right: "10px",
									}}
									size={20}
									title="Show list"
								/>
							</StyledShowNavbarBtn>
						)}
					</PlayerButtonsBar>
				</VolumeEventOverlay>

				{domain === "youtube" ? (
					<YoutubeVideoPlayer playNext={playNext} />
				) : (
					<VideoPlayer
						listIsOpen={!viewStates?.hideList}
						listWidth={viewStates?.listWidth}
						playNext={playNext}
						VolumeEventOverlayRef={VolumeEventOverlayRef}
						setIsPlaying={setIsPlaying}
						childPlayer={childPlayer}
						videoElementRef={videoElementRef}
						setIsFullscreen={setIsFullscreen}
						setStatus={setStatus}
					/>
				)}
				{/* {children} */}

				{!viewStates?.hideList && (
					<>
						{!isFullscreen && (
							<ResizeDevider onMouseDown={handleResizeMouseDown} resizeActive={resizeActive} chatwidth={viewStates?.listWidth}>
								<div />
							</ResizeDevider>
						)}
						<div
							id="chat"
							style={{
								display: isFullscreen ? "none" : "initial",
								overflow: "auto",
								gridArea: "chat",
							}}
						>
							<PlaylistInPlayer
								listName={urlListName}
								listVideos={listVideos}
								setListVideos={setListVideos}
								videoId={videoId}
								setAutoPlayNext={setAutoPlayNext}
								autoPlayNext={autoPlayNext}
								loopList={loopList}
								setLoopList={setLoopList}
								autoPlayRandom={autoPlayRandom}
								setAutoPlayRandom={setAutoPlayRandom}
								playQueue={playQueue}
								setPlayQueue={setPlayQueue}
								playNext={playNext}
								list={listToShow}
								setListToShow={setListToShow}
								isFullscreen={isFullscreen}
							/>
						</div>
					</>
				)}
			</VideoAndChatContainer>
		</>
	);
};

export default SharedVideoPlayer;
