import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Alert from "../../components/alert";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { AddCookie } from "../../utilities";

import "./Home.scss";
import { LogoText, WelcomeContainer, DevideLine } from "./StyledComponents";
import { useUser } from "../../stores/user";
import { useSetNavigationSidebarVisible } from "../../stores/navigation";

export const Home = () => {
	useDocumentTitle();
	const user = useUser();
	const showLoginAlert = useLocation()?.state?.showLoginAlert;
	const setNavigationSidebarVisible = useSetNavigationSidebarVisible();

	const Logos = () => (
		<>
			<WelcomeContainer>
				<LogoText>
					<img rel="preload" src={`${process.env.PUBLIC_URL}/android-chrome-512x512.png`} alt="logo" id="logo" />
					<div>
						<h1>
							<b>AioFeed</b>
						</h1>
						<DevideLine />
						<p>View Twitch & YouTube feeds and Twitter list in one page, with Twitch (live/offline/update) notifications.</p>
						<p>Custom lists with Twitch/YouTube videos.</p>
						<p>Group Twitch live streams by title/category/channel etc... </p>
					</div>
				</LogoText>
			</WelcomeContainer>
		</>
	);

	useEffect(() => {
		AddCookie("asd", "valueee", { expires: Date.now() });
		document.documentElement.setAttribute("homepage", "true");
		window.scrollTo(0, 0);

		return () => document.documentElement.removeAttribute("homepage");
	}, []);

	useEffect(() => {
		if (showLoginAlert) {
			setNavigationSidebarVisible(true, "signin");
		}
	}, [showLoginAlert, setNavigationSidebarVisible]);

	if (showLoginAlert && !user) {
		return (
			<Alert
				type="info"
				title="Login to continue"
				message="Login with your AioFeed account"
				onClick={() => setNavigationSidebarVisible(true, "signin")}
			/>
		);
	}
	return <Logos></Logos>;
};
