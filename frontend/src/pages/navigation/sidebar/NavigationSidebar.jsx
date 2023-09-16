import React from "react";
import { CSSTransition } from "react-transition-group";
import SidebarAccount from "./SidebarAccount";
import { StyledNavSidebarTrigger, StyledLoginButton } from "./../StyledComponents";
import { StyledNavSidebar, StyledNavSidebarBackdrop, StyledSidebarTrigger } from "./StyledComponents";
import { Portal } from "react-portal";
import LoadingIndicator from "../../../components/LoadingIndicator";
import SignUp from "../../account/SignUp";
import SignIn from "../../account/SignIn";
import ForgotPassword from "../../account/ForgotPassword";

import { useUser, useUserLoading } from "../../../stores/user";
import { useNavigationData, useNavigationKey, useNavigationSidebarVisible, useSetNavigationSidebarVisible } from "../../../stores/navigation";

const NavigationSidebar = () => {
	const user = useUser();
	const loading = useUserLoading();
	const navigationKey = useNavigationKey();
	const data = useNavigationData();
	const setNavigationSidebarVisible = useSetNavigationSidebarVisible();
	const showSidebar = useNavigationSidebarVisible();

	const handleToggle = () => setNavigationSidebarVisible(!showSidebar);

	const component = (() => {
		if (user) return <SidebarAccount />;
		switch (navigationKey?.toLowerCase()) {
			case "signup":
				return <SignUp text={data?.text} />;
			case "forgotpassword":
				return <ForgotPassword text={data?.text} />;
			case "signin":
				return <SignIn text={data?.text} />;
			case "account":
			default:
				return user ? <SidebarAccount text={data?.text} /> : <SignIn text={data?.text} />;
		}
	})();

	return (
		<>
			<StyledNavSidebarTrigger onClick={handleToggle} title="Sidebar">
				{user ? (
					<>
						<StyledSidebarTrigger id="NavigationProfileImageHoverOverlay" open={showSidebar} />
						<img id="NavigationProfileImage" src={`${process.env.PUBLIC_URL}/images/webp/placeholder.png`} alt="" />
					</>
				) : loading ? (
					<LoadingIndicator height={32} width={32} />
				) : (
					<StyledLoginButton>Login</StyledLoginButton>
				)}
			</StyledNavSidebarTrigger>

			<CSSTransition in={showSidebar} timeout={350} classNames="NavSidebarBackdropFade" unmountOnExit appear>
				<Portal>
					<StyledNavSidebarBackdrop onClick={() => setNavigationSidebarVisible(false)} />
				</Portal>
			</CSSTransition>

			<CSSTransition in={showSidebar} timeout={showSidebar ? 350 : 150} classNames="NavSidebarSlideRight" unmountOnExit appear>
				<Portal>
					<StyledNavSidebar>{component}</StyledNavSidebar>
				</Portal>
			</CSSTransition>
		</>
	);
};

export default NavigationSidebar;
