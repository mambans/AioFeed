import { MdChat, MdLiveTv } from "react-icons/md";
import { FaWindowClose, FaRegClock, FaTwitch } from "react-icons/fa";

import { useParams, useLocation, Link } from "react-router-dom";
import React, { useEffect, useCallback, useState, useRef } from "react";
import Moment from "react-moment";

import LoadingPlaceholderBanner from "./LoadingPlaceholderBanner";
import LoadingPlaceholderClips from "./LoadingPlaceholderClips";
import LoadingPlaceholderVods from "./LoadingPlaceholderVods";
import SubFeed from "./SubFeed";
import { addVodEndTime } from "./../TwitchUtils";
import {
	ChannelContainer,
	Banner,
	Name,
	BannerInfoOverlay,
	VideoPlayer,
	Chat,
	StyledLiveInfoContainer,
	BlurredBannerImage,
	VideoChatButton,
	ProfileImage,
	NameAndButtons,
	ButtonRow,
	FullDescriptioon,
} from "./StyledComponents";
import FollowUnfollowBtn from "./../FollowUnfollowBtn";
import AddVideoExtraData from "../AddVideoExtraData";
import fetchStreamInfo from "./../player/fetchStreamInfo";
import fetchChannelInfo from "./../player/fetchChannelInfo";
// import setFavion from '../setFavion';
// import AddUpdateNotificationsButton from '../AddUpdateNotificationsButton';
import TwitchAPI from "./../API";
import AnimatedViewCount from "../live/AnimatedViewCount";
import useEventListenerMemo from "../../../hooks/useEventListenerMemo";
import useQuery from "../../../hooks/useQuery";
import loginNameFormat from "../loginNameFormat";
import VodsFollowUnfollowBtn from "../vods/VodsFollowUnfollowBtn";
import AddUpdateNotificationsButton from "../AddUpdateNotificationsButton";
import FavoriteStreamBtn from "../live/FavoriteStreamBtn";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import useFavicon from "../../../hooks/useFavicon";
import Schedule from "../schedule";
import { useRecoilValue } from "recoil";
import { feedVideoSizePropsAtom } from "../../../atoms/atoms";

const ChannelPage = () => {
	const { passedChannelData } = useLocation().state || {};
	const { channelName } = useParams();
	const [channelInfo, setChannelInfo] = useState(passedChannelData);
	const [streamInfo, setStreamInfo] = useState(passedChannelData);
	const feedVideoSizeProps = useRecoilValue(feedVideoSizePropsAtom);

	const numberOfVideos = Math.floor(window.innerWidth / (feedVideoSizeProps?.totalWidth || 350));
	const URLQueries = useQuery();

	const [userId, setUserId] = useState();
	const [vods, setVods] = useState();
	const [clips, setClips] = useState();
	const [sortVodsBy, setSortVodsBy] = useState(URLQueries.get("type")?.toLowerCase() === "vods" ? URLQueries.get("sort")?.toLowerCase() : "time");
	const [sortClipsBy, setSortClipsBy] = useState(URLQueries.get("type")?.toLowerCase() === "clips" ? URLQueries.get("within") : null);
	// const [channelId, setChannelId] = useState(passedChannelData?.user_id);
	const [isLive, setIsLive] = useState();
	const [videoOpen, setVideoOpen] = useState(false);
	const [chatOpen, setChatOpen] = useState(false);

	const vodPagination = useRef();
	const previosVodPage = useRef();
	const previosClipsPage = useRef();
	const clipPagination = useRef();
	const twitchPlayer = useRef();

	useDocumentTitle(`${loginNameFormat(channelInfo) || channelName}'s Page ${isLive ? "(Live)" : ""}`);
	useFavicon(channelInfo?.logo || channelInfo?.profile_image_url);

	useEventListenerMemo(window?.Twitch?.Player?.ONLINE, onlineEvents, twitchPlayer.current);
	useEventListenerMemo(window?.Twitch?.Player?.OFFLINE, offlineEvents, twitchPlayer.current);

	const getIdFromName = useCallback(async () => {
		const user = await TwitchAPI.getUser({
			login: channelName,
		})
			.then((res) => res.data.data[0])
			.catch((error) => "Not Found");

		setChannelInfo((c) => ({ ...c, ...user }));
		return user.id;
	}, [channelName]);

	const fetchChannelVods = useCallback(
		async ({ pagination, setLoading = () => {} } = {}) => {
			if (pagination) {
				setLoading(true);
			} else {
				previosVodPage.current = null;
			}

			await TwitchAPI.getVideos({
				user_id: userId,
				first: numberOfVideos,
				sort: sortVodsBy?.toLowerCase(),
				type: "all",
				after: pagination || null,
			})
				.then(async (res) => {
					setVods((vods = []) => {
						if (res.data.data?.length === 0 && (Array.isArray(vods) || Boolean(vods?.length))) {
							setLoading(false);
						}

						if (!res.data.data?.length && (!vods || !Array.isArray(vods) || !vods?.length)) {
							return { error: "No vods available" };
						}
						return (vods || [])?.slice(0, 100);
					});

					vodPagination.current = res.data.pagination.cursor;

					const videos = await AddVideoExtraData({ items: res.data, fetchGameInfo: false });
					const finallVideos = (await addVodEndTime(videos.data)) || [];

					if (pagination) {
						const allVods = previosVodPage.current.concat(finallVideos) || [];
						previosVodPage.current = allVods?.slice(0, 100);

						setLoading(false);
						setVods(allVods?.slice(0, 100));
					} else {
						previosVodPage.current = finallVideos?.slice(0, 100);
						setVods(finallVideos?.slice(0, 100));
					}
				})
				.catch((e) => {
					console.error(e);
				});
		},
		[numberOfVideos, sortVodsBy, userId]
	);

	const fetchClips = useCallback(
		async ({ pagination, setLoading = () => {} } = {}) => {
			if (pagination) {
				setLoading(true);
			} else {
				previosClipsPage.current = null;
			}

			await TwitchAPI.getClips({
				broadcaster_id: userId,
				first: numberOfVideos,
				after: pagination || null,
				started_at: sortClipsBy && new Date(new Date().setDate(new Date().getDate() - sortClipsBy)).toISOString(),
				ended_at: sortClipsBy && new Date().toISOString(),
			})
				.then(async (res) => {
					setClips((clips) => {
						if (res.data.data?.length === 0 && (clips || Array.isArray(clips) || Boolean(clips?.length))) {
							setLoading(false);
						}
						if (res.data.data?.length === 0 && (!clips || !Array.isArray(clips) || !clips?.length)) {
							return { error: "No clips available" };
						}

						return clips;
					});

					clipPagination.current = res.data.pagination.cursor;

					const finallClips = await AddVideoExtraData({
						items: res.data,
						saveNewProfiles: false,
					});

					if (pagination) {
						const allClips = previosClipsPage.current.concat(finallClips.data);
						previosClipsPage.current = allClips;
						setLoading(false);
						setClips(allClips);
					} else {
						previosClipsPage.current = finallClips.data;
						setClips(finallClips.data);
					}
				})
				.catch((error) => console.error("fetchClips: ", error));
		},
		[numberOfVideos, sortClipsBy, userId]
	);

	const resetAllValues = () => {
		setUserId();
		setChannelInfo();
		setClips();
		setVods();
		// setFavion();
	};

	useEffect(() => {
		(async () => {
			const user_id = await getIdFromName();
			setUserId(user_id);
			if (!user_id || user_id === "Not Found") return false;

			fetchChannelInfo(user_id, true).then((res) => {
				setChannelInfo((c) => ({ ...c, ...res }));
				// if (res) setFavion(res.logo || res.profile_image_url);
			});
		})();

		return () => resetAllValues();
	}, [channelName, getIdFromName]);

	useEffect(() => {
		if (userId) fetchChannelVods();
	}, [userId, fetchChannelVods]);

	useEffect(() => {
		if (userId) fetchClips();
	}, [userId, fetchClips]);

	async function onlineEvents() {
		console.log("Stream is Online");

		try {
			if (twitchPlayer.current) {
				const streamInfo = await fetchStreamInfo(
					twitchPlayer.current && twitchPlayer.current.getChannelId() ? { user_id: twitchPlayer.current.getChannelId() } : { user_login: channelName }
				);

				if (streamInfo) {
					setStreamInfo(streamInfo);
					setIsLive(true);
				}
			}
		} catch (error) {
			console.log("onlineEvents -> error", error);
		}
	}

	function offlineEvents() {
		console.log("Stream is Offline");
		setIsLive(false);
	}

	useEffect(() => {
		if (userId !== "Not Found") {
			if (twitchPlayer.current) {
				twitchPlayer.current.setChannelId(userId);
			} else if (window?.Twitch?.Player) {
				twitchPlayer.current = new window.Twitch.Player("twitch-embed", {
					width: `${300 * 1.777777777777778}px`,
					height: "300px",
					theme: "dark",
					layout: "video",
					channel: channelName,
					muted: true,
				});
			}
		}
	}, [channelName, userId]);
	console.log("channelInfo:", channelInfo);

	if (userId === "Not Found") {
		return (
			<ChannelContainer>
				<Banner>
					<BannerInfoOverlay
						style={{
							backgroundColor: "var(--navigationbarBackground)",
							width: "calc(100% - 60px)",
							margin: "auto",
							borderRadius: "15px",
						}}
					>
						<Name>
							<div style={{ fontSize: "1.5rem" }}>
								<span style={{ fontSize: "0.85em" }}>{"Sry, "}</span>
								<b>{channelName}</b>
								{"'s"}
								<span style={{ fontSize: "0.85em" }}>{" channel could not be found."}</span>
							</div>
						</Name>
					</BannerInfoOverlay>
				</Banner>
				<LoadingPlaceholderVods numberOfVideos={numberOfVideos} title="Not found.." freeze />
				<LoadingPlaceholderClips numberOfVideos={numberOfVideos} title="Not found.." freeze />
			</ChannelContainer>
		);
	} else {
		return (
			<>
				<ChannelContainer>
					<VideoPlayer id="twitch-embed" style={{ display: videoOpen ? "block" : "none" }} />
					{chatOpen && (
						<Chat
							frameborder="0"
							scrolling="yes"
							theme="dark"
							src={`https://www.twitch.tv/embed/${channelName}/chat?darkpopout&parent=aiofeed.com`}
						/>
					)}
					{videoOpen ? (
						<VideoChatButton
							title="Close video"
							id="closeVideo"
							onClick={() => {
								setVideoOpen(!videoOpen);
							}}
						>
							<FaWindowClose size={20} />
							Close video
						</VideoChatButton>
					) : (
						<VideoChatButton
							title="Open video"
							id="openVideo"
							onClick={() => {
								setVideoOpen(!videoOpen);
							}}
						>
							<MdLiveTv size={30} />
							Open video
						</VideoChatButton>
					)}
					{chatOpen ? (
						<VideoChatButton
							title="Close chat"
							id="closeChat"
							onClick={() => {
								setChatOpen(!chatOpen);
							}}
						>
							Close chat
							<FaWindowClose size={20} />
						</VideoChatButton>
					) : (
						<VideoChatButton
							title="Open chat"
							id="openChat"
							onClick={() => {
								setChatOpen(!chatOpen);
							}}
						>
							Open chat
							<MdChat size={30} />
						</VideoChatButton>
					)}
					{channelInfo ? (
						<Banner>
							<BannerInfoOverlay>
								<Name>
									{channelInfo && <BlurredBannerImage image={channelInfo.profile_banner} />}

									<div id="HeaderChannelInfo">
										<div id="ChannelName">
											{Boolean(isLive && streamInfo) && (
												<StyledLiveInfoContainer
													to={{
														pathname: `/${channelName}`,
														state: {
															passedChannelData: streamInfo,
														},
													}}
												>
													<div id="LiveDetails">
														<AnimatedViewCount disabePrefix={true} viewers={streamInfo.viewer_count} />
														<span>
															<Moment interval={1} durationFromNow>
																{streamInfo.started_at}
															</Moment>
															<FaRegClock size={12} />
														</span>
													</div>
												</StyledLiveInfoContainer>
											)}
											<Link
												to={{
													pathname: `/${channelName}`,
													state: {
														passedChannelData: streamInfo,
													},
												}}
												className="ChannelLiveLink"
											>
												<ProfileImage live={Boolean(isLive && streamInfo)}>
													<img alt="" src={channelInfo.logo || channelInfo.profile_image_url} />
													{Boolean(isLive && streamInfo) && <div id="live">Live</div>}
												</ProfileImage>
											</Link>
											<NameAndButtons>
												<div className="buttonsContainer">
													{channelInfo.partner && <img id="partnered" title="Partnered" alt="" src={`${process.env.PUBLIC_URL}/partnered.png`} />}
													<FollowUnfollowBtn show={channelInfo} channelName={channelName} id={channelInfo._id} />
													<FavoriteStreamBtn
														channel={channelInfo.name || channelName}
														id={channelInfo._id}
														show={Boolean(channelInfo)}
														marginright={"5px"}
													/>
													<VodsFollowUnfollowBtn size={28} channel={channelInfo} />

													<AddUpdateNotificationsButton show={channelInfo} channel={channelInfo} size={26} />
													<Schedule
														user={channelInfo.name || channelName}
														user_id={channelInfo._id}
														absolute={false}
														style={{ padding: 0, marginRight: "5px" }}
													/>
													<a
														className="twitchRedirect"
														alt=""
														href={`https://www.twitch.tv/${channelInfo.name || channelName}?redirect=false`}
														style={{ margin: "0 5px" }}
													>
														<FaTwitch size={22} color="purple" />
													</a>
												</div>
												<Link
													to={{
														pathname: `/${channelName}`,
														state: {
															passedChannelData: streamInfo,
														},
													}}
													id="name"
												>
													{loginNameFormat({ ...channelInfo, login: channelInfo.name })}
												</Link>
											</NameAndButtons>
										</div>
										<Link
											id="title"
											to={{
												pathname: `/${channelName}`,
												state: {
													passedChannelData: streamInfo || channelInfo,
												},
											}}
											className="ChannelLiveLink"
										>
											{channelInfo.status}
										</Link>
										<span>
											{Boolean(isLive && streamInfo) ? "Playing " : "Played "}
											<Link to={`/category/${channelInfo.game}`} id="game">
												{channelInfo.game}
											</Link>
										</span>

										<ButtonRow>
											<FullDescriptioon>{channelInfo.description}</FullDescriptioon>
											<div id="stats">
												<p>{channelInfo.followers} followers</p>
												<p>{channelInfo.views} views</p>
											</div>
										</ButtonRow>
									</div>
								</Name>
							</BannerInfoOverlay>
						</Banner>
					) : (
						<LoadingPlaceholderBanner />
					)}
					{vods ? (
						<SubFeed
							feedName="Vods"
							items={vods}
							sortBy={sortVodsBy}
							setSortBy={setSortVodsBy}
							setSortData={setVods}
							fetchItems={fetchChannelVods}
							itemPagination={vodPagination}
						/>
					) : (
						<LoadingPlaceholderVods numberOfVideos={numberOfVideos} />
					)}
					{clips ? (
						<SubFeed
							feedName="Clips"
							items={clips}
							sortBy={sortClipsBy}
							setSortBy={setSortClipsBy}
							setSortData={setClips}
							fetchItems={fetchClips}
							itemPagination={clipPagination}
							channelInfo={channelInfo}
						/>
					) : (
						<LoadingPlaceholderClips numberOfVideos={numberOfVideos} />
					)}
				</ChannelContainer>
			</>
		);
	}
};
export default ChannelPage;
