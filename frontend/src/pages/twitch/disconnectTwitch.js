import axios from "axios";
import { getCookie, RemoveCookie } from "../../utilities";
import API from "../navigation/API";

const disconnectTwitch = async ({ setTwitchToken = () => {}, setEnableTwitch = () => {} }) => {
	await axios
		.post(`https://id.twitch.tv/oauth2/revoke?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&token=${getCookie("Twitch-access_token")}`)
		.catch((er) => console.error(er));

	RemoveCookie("Twitch-access_token");
	RemoveCookie("Twitch-refresh_token");
	RemoveCookie("Twitch-userId");
	RemoveCookie("Twitch-username");
	RemoveCookie("Twitch-profileImg");
	RemoveCookie("Twitch-myState");

	setTwitchToken();
	setEnableTwitch(false);

	await API.deleteTwitchDataUser();
};
export default disconnectTwitch;
