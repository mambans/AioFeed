import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import styled from "styled-components";

import Feed from "../feed";
import Footer from "../footer";
import { Home } from "../home";
import Legality from "../legality";
import Navigation from "../navigation";

import TwitchAuthCallback from "../auth/TwitchAuthCallback";
// import TwitchChannelRoutes from '../twitch/Routes';
import YoutubeAuthCallback from "../auth/YoutubeAuthCallback";
import SharedVideoPlayer from "../sharedComponents/SharedVideoPlayer";
import VerifyEmail from "../account/VerifyEmail";
import Player from "../twitch/player/Player";
import StandaloneChat from "../twitch/player/StandaloneChat";
import LoadingIndicator from "../../components/LoadingIndicator";
import LoadingFeed from "../../components/LoadingFeed";
import useUserStore from "../../stores/userStore";

// import TopStreams from '../twitch/categoryTopStreams';
const TopStreams = React.lazy(() => import("../twitch/categoryTopStreams"));
// const Player = React.lazy(() => import('../twitch/player/Player'));
const TwitchChannelRoutes = React.lazy(() => import("../twitch/Routes"));

const MainContentContainer = styled.main`
	min-height: 100vh;
	padding-top: 95px;
`;

const routes = [
	{
		path: "index",
		element: <Home />,
		authRequired: true,
	},
	{
		path: "/",
		element: <Home />,
		index: true,
		authRequired: true,
	},
	{
		path: "home",
		element: <Home />,
		authRequired: true,
	},
	{
		path: "legality",
		element: <Legality />,
	},
	{
		path: "privacy",
		element: <Legality />,
	},
	{
		path: "verify-email",
		element: <VerifyEmail />,
	},
	{
		path: "feed",
		element: <Feed />,
		authRequired: true,
	},
	{
		path: "auth/twitch/callback",
		element: <TwitchAuthCallback />,
	},
	{
		path: "auth/youtube/callback",
		element: <Route path="auth/youtube/callback" element={<YoutubeAuthCallback />} />,
	},
	{
		path: "youtube/:videoId",
		element: <SharedVideoPlayer />,
		authRequired: true,
	},
	{
		path: "category",
		element: (
			<Suspense fallback={<LoadingFeed title={"Top streams"} />}>
				<TopStreams />
			</Suspense>
		),
	},
	{
		path: "game",
		element: <Navigate to={"../category"} replace />,
	},
	{
		path: "category/:category",
		element: (
			<Suspense fallback={<LoadingFeed title={"Top streams"} />}>
				<TopStreams />
			</Suspense>
		),
	},
	{
		path: "game/:category",
		element: (
			<Suspense fallback={<LoadingFeed title={"Top streams"} />}>
				<TopStreams />
			</Suspense>
		),
	},
	{
		path: "top/:category",
		element: (
			<Suspense fallback={<LoadingFeed title={"Top streams"} />}>
				<TopStreams />
			</Suspense>
		),
	},
	{
		path: "category/:category/:type",
		element: (
			<Suspense fallback={<LoadingFeed title={"Top streams"} />}>
				<TopStreams />
			</Suspense>
		),
	},
	{
		path: "videos/:videoId",
		element: <SharedVideoPlayer />,
		authRequired: true,
	},
	{
		path: "twitch/:channelName",
		element: <Player />,
	},
	// {
	//   path: 'twitch/:channelName',
	//   element: (
	//     <Suspense>
	//       <Player />
	//     </Suspense>
	//   ),
	// },
	{
		path: ":channelName",
		element: (
			<Suspense>
				<Player />
			</Suspense>
		),
	},
	{
		path: ":channelName/chat",
		element: <StandaloneChat />,
	},
	{
		path: ":channelName/*",
		element: (
			<Suspense>
				<TwitchChannelRoutes />
			</Suspense>
		),
		authRequired: true,
	},
];

const NavigationRoutes = () => {
	const { user, loading } = useUserStore();

	return (
		<BrowserRouter>
			<Navigation />
			<MainContentContainer id="MainContentContainer" tabIndex={0}>
				<Routes>
					{routes.map(({ element, authRequired, ...rest }, key) => {
						return (
							<Route
								{...rest}
								key={key}
								element={
									authRequired ? (
										loading === "loading" ? (
											<LoadingIndicator height={400} width={600} text={"Authenticating.."} />
										) : !user === "hasError" ? (
											<Navigate to="/" state={{ showLoginAlert: true }} replace />
										) : (
											element
										)
									) : (
										element
									)
								}
							/>
						);
					})}
				</Routes>
			</MainContentContainer>
			<Footer />
		</BrowserRouter>
	);
};

export default NavigationRoutes;
