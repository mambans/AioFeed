import { CSSTransition } from "react-transition-group";
import React, { Suspense } from "react";

import NoFeedsEnable from "./NoFeedsEnabled";
import FeedsCenterContainer from "./FeedsCenterContainer";
import FeedOrderSlider from "./FeedOrderSlider";
import LoadingFeed from "../../components/LoadingFeed";
import Colors from "../../components/themes/Colors";
import { FaYoutube } from "react-icons/fa";
import { MdVideocam } from "react-icons/md";
import { HiViewList } from "react-icons/hi";
import { useFeedPreferences } from "../../stores/feedPreference";
const Twitch = React.lazy(() => import("../twitch/live"));
const Vods = React.lazy(() => import("../twitch/vods"));
const Twitter = React.lazy(() => import("../twitter"));
const Youtube = React.lazy(() => import("../youtube"));
const MyLists = React.lazy(() => import("../myLists"));

// import useDocumentTitle from '../../hooks/useDocumentTitle';

const Feed = () => {
	const feedPreferences = useFeedPreferences();
	const { twitch, youtube, vods, mylists, twitter } = feedPreferences || {};
	return (
		<FeedsCenterContainer>
			<NoFeedsEnable />
			<CSSTransition in={twitter?.enabled} timeout={750} classNames="twitter-slide" unmountOnExit appear={true}>
				<Suspense fallback={<div></div>}>
					<Twitter />
				</Suspense>
			</CSSTransition>

			<div className="feed">
				<FeedOrderSlider />

				<CSSTransition in={twitch?.enabled} classNames="fade-750ms" timeout={750} unmountOnExit appear>
					<Suspense
						fallback={
							<LoadingFeed
								order={twitch?.order}
								title={
									<h1 id={"twitch"}>
										Twitch
										<span
											style={{
												background: Colors.red,
												fontWeight: "bold",
												borderRadius: "5px",
												fontSize: "0.9em",
												padding: "0px 3px",
												marginLeft: "5px",
											}}
										>
											Live
										</span>
									</h1>
								}
							/>
						}
					>
						<Twitch />
					</Suspense>
				</CSSTransition>
				<CSSTransition in={youtube?.enabled} timeout={750} classNames="fade-750ms" unmountOnExit appear>
					<Suspense
						fallback={
							<LoadingFeed
								order={youtube?.order}
								title={
									<h1 id="youtube">
										YouTube
										<FaYoutube size={25} style={{ color: "#a80000" }} />
									</h1>
								}
							/>
						}
					>
						<Youtube />
					</Suspense>
				</CSSTransition>

				<CSSTransition in={vods?.enabled} classNames="fade-750ms" timeout={750} unmountOnExit>
					<Suspense
						fallback={
							<LoadingFeed
								order={vods?.order}
								title={
									<h1 id="vods">
										Twitch vods
										<MdVideocam size={25} style={{ color: "#6f166f" }} />
									</h1>
								}
							/>
						}
					>
						<Vods />
					</Suspense>
				</CSSTransition>

				<CSSTransition in={mylists?.enabled} timeout={750} classNames="fade-750ms" unmountOnExit appear>
					<Suspense
						fallback={
							<LoadingFeed
								order={999}
								title={
									<h1 id={"lists"}>
										Lists
										<HiViewList size={25} color={Colors.green} />
									</h1>
								}
							/>
						}
					>
						<MyLists />
					</Suspense>
				</CSSTransition>
			</div>
		</FeedsCenterContainer>
	);
};

export default Feed;
