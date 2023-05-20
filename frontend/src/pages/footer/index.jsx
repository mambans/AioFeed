import { FaGithub, FaHome } from "react-icons/fa";
import { MdAccountCircle, MdEmail, MdRssFeed } from "react-icons/md";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import React, { useContext, useState, useRef } from "react";

import { StyledFooterContainer, StyledCenterBottomText, StyledButtonLinks } from "./styledComponents";
import ChangeLogs from "../changeLogs";
import styles from "../changeLogs/ChangeLogs.module.scss";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { footerVisibleAtom, navigationSidebarAtom, navigationSidebarComponentKeyAtom } from "../navigation/atoms";
import useUserStore from "../../stores/userStore";

const Footer = () => {
	const { user } = useUserStore();
	const setNavigationSidebarComponentKey = useSetRecoilState(navigationSidebarComponentKeyAtom);

	const footerVisible = useRecoilValue(footerVisibleAtom);

	const showNavigationSidebar = useSetRecoilState(navigationSidebarAtom);

	const [show, setShow] = useState();
	const ref = useRef();

	const handleClose = () => setShow(false);

	return (
		footerVisible && (
			<StyledFooterContainer ref={ref}>
				<div>
					<ul>
						<li>
							<Nav.Link as={NavLink} to="/">
								<FaHome size={20} style={{ marginRight: "0.75rem" }} />
								Home
							</Nav.Link>
						</li>
						<li>
							<Nav.Link as={NavLink} to="/feed">
								<MdRssFeed size={20} style={{ marginRight: "0.75rem" }} />
								Feed
							</Nav.Link>
						</li>
						<li>
							{(user && (
								<div
									className="button"
									onClick={() => {
										setNavigationSidebarComponentKey({ comp: "account" });
										showNavigationSidebar(true);
									}}
								>
									<MdAccountCircle size={20} style={{ marginRight: "0.75rem" }} />
									Account
								</div>
							)) || (
								<>
									<div
										className="button"
										onClick={() => {
											setNavigationSidebarComponentKey({ comp: "SignIn" });
											showNavigationSidebar(true);
										}}
									>
										<MdAccountCircle size={20} style={{ marginRight: "0.75rem" }} />
										Sign in
									</div>
									<div
										className="button"
										onClick={() => {
											setNavigationSidebarComponentKey({ comp: "SignUp" });
											showNavigationSidebar(true);
										}}
									>
										<MdAccountCircle size={20} style={{ marginRight: "0.75rem" }} />
										Create an account
									</div>
								</>
							)}
						</li>
					</ul>
				</div>
				<div style={{ flexDirection: "column", width: "50%" }}>
					<StyledCenterBottomText>
						<Nav.Link as={NavLink} to="/legality#Conditions">
							Conditions of Use
						</Nav.Link>
						<Nav.Link as={NavLink} to="/legality#Privacy">
							Privacy Notice
						</Nav.Link>
						<span>© 2020 Sweden, Robin Persson.</span>
					</StyledCenterBottomText>
				</div>
				<div>
					<ul>
						<li>
							<a href="https://github.com/mambans/AioFeed">
								<FaGithub size={20} style={{ marginRight: "0.75rem" }} />
								AioFeed on Github
							</a>
						</li>
						<li>
							<StyledButtonLinks onClick={() => setShow(!show)}>
								<FaGithub size={20} style={{ marginRight: "0.75rem" }} />
								Changelog
							</StyledButtonLinks>
						</li>
						<li>
							<StyledButtonLinks onClick={() => window.open("mailto:perssons1996@gmail.com?subject=subject&body=body")}>
								<MdEmail size={20} style={{ marginRight: "0.75rem" }} />
								Email
							</StyledButtonLinks>
						</li>
					</ul>
				</div>
				<Modal show={show} onHide={handleClose} dialogClassName={styles.modal} backdropClassName={styles.modalBackdrop}>
					<ChangeLogs handleClose={handleClose} />
				</Modal>
			</StyledFooterContainer>
		)
	);
};

export default Footer;
