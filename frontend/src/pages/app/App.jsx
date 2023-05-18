import React, { useContext } from "react";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { NotificationsProvider } from "../notifications/NotificationsContext";
import CookieConsentAlert from "./CookieConsentAlert";
import Routes from "../routes";
import ThemeContext, { ThemeProvider } from "./../../components/themes/ThemeContext";
import useEventListenerMemo from "../../hooks/useEventListenerMemo";
import { TwitchContext, TwitchProvider } from "../twitch/useToken";
import { YoutubeContext, YoutubeProvider } from "../youtube/useToken";
import { VodsProvider } from "../twitch/vods/VodsContext";
import { MyListsProvider } from "../myLists/MyListsContext";
import { LogsProvider } from "../logs/LogsContext";
import { FeedSectionsProvider } from "../feedSections/FeedSectionsContext";
import { TwitterProvider } from "../twitter/TwitterContext";
import CleanUp from "./CleanUp";
import { RecoilRoot } from "recoil";
import { AccountProvider } from "../account/AccountContext";
import { useFeedPreferences } from "../../atoms/atoms";

const AppContainer = styled.div`
	background-image: ${({ image }) => `url(/images/${image})`};
	background-color: var(--backgroundColor);
	object-fit: cover;
	background-position-x: center;
	background-position-y: var(--backgroundImgPositionY);
	background-size: var(--backgroundImgSize);
	background-repeat: var(--backgroundImgRepeat);
	background-attachment: fixed;

	scrollbar-color: var(--scrollbarColors) !important;
	scrollbar-width: thin !important;

	/* body.modal-open & {
    background-position-x: -8px;
  } */
`;

const AppRoutesContainer = () => {
	return (
		// <React.StrictMode>
		<RecoilRoot>
			<LogsProvider>
				<ThemeProvider>
					<AccountProvider>
						<TwitchProvider>
							<YoutubeProvider>
								<NotificationsProvider>
									<TwitterProvider>
										<FeedSectionsProvider>
											<MyListsProvider>
												<VodsProvider>
													<App />
												</VodsProvider>
											</MyListsProvider>
										</FeedSectionsProvider>
									</TwitterProvider>
								</NotificationsProvider>
							</YoutubeProvider>
						</TwitchProvider>
					</AccountProvider>
				</ThemeProvider>
			</LogsProvider>
		</RecoilRoot>
		// {/* </React.StrictMode> */}
	);
};

const App = () => {
	const { activeTheme } = useContext(ThemeContext);
	const { toggleEnabled } = useFeedPreferences();
	const { setTwitchAccessToken, setTwitchRefreshToken, setTwitchUserId, setTwitchUsername, setTwitchProfileImage } = useContext(TwitchContext);
	const { setYoutubeAccessToken, setYoutubeUsername, setYoutubeProfileImage } = useContext(YoutubeContext);

	useEventListenerMemo("message", receiveMessage, window, true, { capture: false });

	function receiveMessage(e) {
		if (e.origin.startsWith("https://aiofeed.com") && e.data?.token && e.data?.service) {
			if (e.data.service === "twitch") {
				if (setTwitchAccessToken) setTwitchAccessToken(e.data.token);
				if (setTwitchRefreshToken) setTwitchRefreshToken(e.data.refresh_token);
				if (setTwitchUsername) setTwitchUsername(e.data.username);
				if (setTwitchUserId) setTwitchUserId(e.data.userId);
				if (setTwitchProfileImage) setTwitchProfileImage(e.data.profileImg);

				toggleEnabled("twitch", true);
			} else if (e.data.service === "youtube") {
				if (e.data.token && setYoutubeAccessToken) setYoutubeAccessToken(e.data.token);
				if (e.data.username && setYoutubeUsername) setYoutubeUsername(e.data.username);
				if (e.data.profileImg && setYoutubeProfileImage) setYoutubeProfileImage(e.data.profileImg);
				toggleEnabled("youtube", true);
			}
		}
	}

	return (
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
	);
};

export default AppRoutesContainer;
