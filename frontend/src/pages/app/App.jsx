import React, { useContext, useEffect } from "react";
import styled, { ThemeProvider as StyledThemeProvider } from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { NotificationsProvider } from "../notifications/NotificationsContext";
import CookieConsentAlert from "./CookieConsentAlert";
import Routes from "../routes";
import ThemeContext, { ThemeProvider } from "./../../components/themes/ThemeContext";
import useEventListenerMemo from "../../hooks/useEventListenerMemo";
import { TwitchContext, TwitchProvider } from "../twitch/useToken";
import { YoutubeContext, YoutubeProvider } from "../youtube/useToken";
import { MyListsProvider } from "../myLists/MyListsContext";
import LogsContext, { LogsProvider } from "../logs/LogsContext";
import { TwitterProvider } from "../twitter/TwitterContext";
import CleanUp from "./CleanUp";
import { Background } from "./Styles";

import useThemeStore from "../../stores/theme/themeStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalStyles } from "../../themes/GlobalStyles";
import { Hub, Logger } from "aws-amplify";
import { useUserSetUser } from "../../stores/user";
import { useToggleFeedPreference } from "../../stores/feedPreference";

const queryClient = new QueryClient();

const AppContainer = styled.div`
	/* background-image: ${({ image }) => `url(/images/${image})`}; */
	/* background-color: var(--backgroundColor);
	object-fit: cover;
	background-position-x: center;
	background-position-y: var(--backgroundImgPositionY);
	background-size: var(--backgroundImgSize);
	background-repeat: var(--backgroundImgRepeat);
	background-attachment: fixed; */

	scrollbar-color: var(--scrollbarColors) !important;
	scrollbar-width: thin !important;

	/* body.modal-open & {
    background-position-x: -8px;
  } */
`;

const AppRoutesContainer = () => {
	return (
		// <React.StrictMode>
		<LogsProvider>
			<ThemeProvider>
				<TwitchProvider>
					<YoutubeProvider>
						<NotificationsProvider>
							<TwitterProvider>
								<MyListsProvider>
									<App />
								</MyListsProvider>
							</TwitterProvider>
						</NotificationsProvider>
					</YoutubeProvider>
				</TwitchProvider>
			</ThemeProvider>
		</LogsProvider>
		// {/* </React.StrictMode> */}
	);
};

const App = () => {
	const { activeTheme } = useContext(ThemeContext);
	const togglePreference = useToggleFeedPreference();

	const { setTwitchAccessToken, setTwitchRefreshToken, setTwitchUserId, setTwitchUsername, setTwitchProfileImage } = useContext(TwitchContext);
	const { setYoutubeAccessToken, setYoutubeUsername, setYoutubeProfileImage } = useContext(YoutubeContext);
	const { addLog } = useContext(LogsContext);

	const theme = useThemeStore((state) => state.theme);
	const setUser = useUserSetUser();

	useEffect(() => {
		//Fix this runs twice for some reason
		(async () => {
			console.log("logger useEffect:");
			const logger = new Logger("My-Logger");
			const listener = (data) => {
				switch (data?.payload?.event) {
					case "signIn":
						logger.info("logger: user signed in");
						console.log("logger: user signed in");
						setUser(data?.payload?.data);
						toast.success(`Logged in as ${data?.payload?.data?.username}`);
						addLog({
							title: `Sign in`,
							text: `Signed in as ${data?.payload?.data?.username}`,
							icon: "login",
						});
						break;
					case "signUp":
						logger.info("logger: user signed up");
						console.log("logger: user signed up");
						break;
					case "signOut":
						logger.info("logger: user signed out");
						console.log("logger: user signed out");
						setUser(null);
						toast.success(`Signed out`);
						addLog({
							title: `Signed out`,
							icon: "login",
						});
						break;
					case "signIn_failure":
						logger.error("logger: user sign in failed");
						console.log("logger: user sign in failed");
						toast.warning(data?.payload?.data?.message);
						break;
					case "tokenRefresh":
						logger.info("logger: token refresh succeeded");
						console.log("logger: token refresh succeeded");
						break;
					case "tokenRefresh_failure":
						logger.error("logger: token refresh failed");
						console.log("logger: token refresh failed");
						break;
					case "configured":
						logger.info("logger: the Auth module is configured");
						console.log("logger: the Auth module is configured");
						break;
					default:
						return;
				}
			};

			Hub.listen("auth", listener);
		})();
	}, [addLog, setUser]);

	useEventListenerMemo("message", receiveMessage, window, true, { capture: false });

	function receiveMessage(e) {
		if (e.origin.startsWith("https://aiofeed.com") && e.data?.token && e.data?.service) {
			if (e.data.service === "twitch") {
				if (setTwitchAccessToken) setTwitchAccessToken(e.data.token);
				if (setTwitchRefreshToken) setTwitchRefreshToken(e.data.refresh_token);
				if (setTwitchUsername) setTwitchUsername(e.data.username);
				if (setTwitchUserId) setTwitchUserId(e.data.userId);
				if (setTwitchProfileImage) setTwitchProfileImage(e.data.profileImg);

				togglePreference("twitch", "enabled", true);
			} else if (e.data.service === "youtube") {
				if (e.data.token && setYoutubeAccessToken) setYoutubeAccessToken(e.data.token);
				if (e.data.username && setYoutubeUsername) setYoutubeUsername(e.data.username);
				if (e.data.profileImg && setYoutubeProfileImage) setYoutubeProfileImage(e.data.profileImg);
				togglePreference("youtube", "enabled", true);
			}
		}
	}

	return (
		<QueryClientProvider client={queryClient}>
			<StyledThemeProvider theme={theme}>
				<GlobalStyles />
				<Background />
				<AppContainer id="AppContainer" image={activeTheme.image}>
					<CleanUp />
					<Routes />
					<CookieConsentAlert />
					<ToastContainer
						position="bottom-right"
						autoClose={3000}
						newestOnTop={false}
						closeOnClick
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme="dark"
					/>
				</AppContainer>
			</StyledThemeProvider>
		</QueryClientProvider>
	);
};

export default AppRoutesContainer;
