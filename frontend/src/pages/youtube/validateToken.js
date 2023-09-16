import axios from "axios";
import { getCookie } from "../../utilities";
import autoReauthenticate from "./autoReauthenticate";
import { Auth } from "aws-amplify";

let promise = null;

const validateToken = async () => {
	if (!(await Auth.currentAuthenticatedUser())) return null;

	const validPromise = await validationOfToken();
	return validPromise?.access_token;
};

const validationOfToken = async () => {
	if (!promise?.requestPromise || Date.now() > promise?.ttl) {
		const request = validateTokenFunc();
		promise = {
			requestPromise: request,
			ttl: Date.now() + ((request?.expires_in || 30) - 20) * 1000,
		};
	}

	return promise?.requestPromise;
};

const validateTokenFunc = async () => {
	const access_token = getCookie("Youtube-access_token");

	if (access_token) {
		// console.log('Youtube: Validating token..');
		return await axios
			.post(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${access_token}`)
			.then((res) => ({ ...res, access_token }))
			.catch((error) => {
				console.warn("YouTube: Invalid Access_token");
				return autoReauthenticate();
			});
	}
	console.warn("YouTube: No Access_token found");
	return autoReauthenticate();
	// throw new Error('No tokens found.');
};

export default validateToken;

// 3599;
