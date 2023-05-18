import { useEffect } from "react";

const CleanUp = () => {
	useEffect(() => {
		try {
			// console.log('CleanUp CleanUp:');
			localStorage.removeItem("TwitchChatState");
		} catch (error) {
			console.log("error:", error);
		}
	}, []);

	return null;
};
export default CleanUp;
