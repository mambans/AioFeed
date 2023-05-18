import React, { useContext, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";

import AccountContext from "./../../account/AccountContext";
import SidebarAccount from "./SidebarAccount";
import { StyledNavSidebarTrigger, StyledLoginButton } from "./../StyledComponents";
import { StyledNavSidebar, StyledNavSidebarBackdrop, StyledSidebarTrigger } from "./StyledComponents";
import { Portal } from "react-portal";
import LoadingIndicator from "../../../components/LoadingIndicator";
import SignUp from "../../account/SignUp";
import SignIn from "../../account/SignIn";
import ForgotPassword from "../../account/ForgotPassword";
import { useRecoilState, useRecoilValue } from "recoil";
import { navigationSidebarAtom, navigationSidebarComponentKeyAtom } from "../atoms";

const NavigationSidebar = () => {
	const { user, loading } = useContext(AccountContext);
	const navigationSidebarComponentKey = useRecoilValue(navigationSidebarComponentKeyAtom);
	const invoked = useRef();

	const [showSidebar, setShowNavigationSidebar] = useRecoilState(navigationSidebarAtom);

	const handleToggle = () => setShowNavigationSidebar((c) => !c);

	const component = (() => {
		if (user) return <SidebarAccount />;
		switch (navigationSidebarComponentKey?.comp?.toLowerCase()) {
			case "signup":
				return <SignUp text={navigationSidebarComponentKey?.text} />;
			case "forgotpassword":
				return <ForgotPassword text={navigationSidebarComponentKey?.text} />;
			case "signin":
				return <SignIn text={navigationSidebarComponentKey?.text} />;
			case "account":
			default:
				return user ? <SidebarAccount text={navigationSidebarComponentKey?.text} /> : <SignIn text={navigationSidebarComponentKey?.text} />;
		}
	})();

	useEffect(() => {
		if (invoked.current && navigationSidebarComponentKey) {
			setShowNavigationSidebar(true);
		}
		invoked.current = true;
	}, [navigationSidebarComponentKey, setShowNavigationSidebar]);

	return (
		<>
			<StyledNavSidebarTrigger onClick={handleToggle} title="Sidebar">
				{user ? (
					<>
						<StyledSidebarTrigger id="NavigationProfileImageHoverOverlay" open={showSidebar} />
						<img id="NavigationProfileImage" src={`${process.env.PUBLIC_URL}/images/webp/placeholder.webp`} alt="" />
					</>
				) : loading ? (
					<LoadingIndicator height={32} width={32} />
				) : (
					<StyledLoginButton>Login</StyledLoginButton>
				)}
			</StyledNavSidebarTrigger>

			<CSSTransition in={showSidebar} timeout={350} classNames="NavSidebarBackdropFade" unmountOnExit appear>
				<Portal>
					<StyledNavSidebarBackdrop onClick={() => setShowNavigationSidebar(false)} />
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
