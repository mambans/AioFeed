import React from "react";
import { Button } from "react-bootstrap";
import { GoSignOut } from "react-icons/go";
import ToolTip from "../../../components/tooltip/ToolTip";
import { useUserSignOut } from "../../../stores/user";
import { useSetNavigationSidebarVisible } from "../../../stores/navigation";

const Logout = () => {
	const signOut = useUserSignOut();
	const setNavigationSidebarVisible = useSetNavigationSidebarVisible();

	const logout = async () => {
		const loggedOut = await signOut();
		console.log("loggedOut:", loggedOut);
		setNavigationSidebarVisible(false, "signin");
	};

	return (
		<ToolTip tooltip="Logout">
			<Button style={{ width: "100%" }} onClick={logout} variant="secondary">
				Logout
				<GoSignOut size={24} style={{ marginLeft: "0.75rem" }} />
			</Button>
		</ToolTip>
	);
};
export default Logout;
