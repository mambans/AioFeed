import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import Cookies from "js-cookie";
import { Amplify, Auth, Hub, Logger } from "aws-amplify";

// console.log("process.env.VITE_USER_POOL_ID:", process.env.REACT_APP_USER_POOL_ID);
// console.log("process.env.REACT_APP_USER_POOL_CLIENT_ID:", process.env.REACT_APP_USER_POOL_CLIENT_ID);

Amplify.configure({
	Auth: {
		region: "eu-north-1",
		userPoolId: process.env.REACT_APP_USER_POOL_ID,
		userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
	},
});

interface UserStore {
	user?: any;
	loading: boolean;
	error: string | null | undefined | any;
	setUser: (title: any) => void;
	setLoading: (loading: boolean) => void;
	signIn: ({ username, password }: { username: string; password: string }) => void;
	signOut: () => void;
	deleteUser: () => void;
	fetchUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
	user: null,
	// user: (async () => {
	// 	// const { isLoading, error, data } = useQuery({
	// 	// 	queryKey: ["user"],
	// 	// 	queryFn: Auth.currentAuthenticatedUser(),
	// 	// });
	// 	// console.log("isLoading:", isLoading);
	// 	// console.log(" error:", error);
	// 	// console.log("data:", data);

	// 	console.log("123");

	// 	try {
	// 		const result = await Auth.currentAuthenticatedUser();
	// 		console.log("result:", result);

	// 		set({ user: result });
	// 		return null;
	// 	} catch (error: any) {
	// 		set({ error, loading: false });
	// 		return null;
	// 	}
	// })(),
	loading: true,
	error: null,
	setUser: (user) => set(() => ({ user })),
	setLoading: (loading) => set(() => ({ loading })),
	fetchUser: async () => {
		console.log("fetchUser:");
		try {
			const result = await Auth.currentAuthenticatedUser();
			console.log("result:", result);
			set({ user: result, error: null });
			return null;
		} catch (error: any) {
			console.log("error:", error);
			set({ error });
			return null;
		} finally {
			console.log("finally:");
			set({ loading: false });
		}
	},

	signIn: async ({ username, password }) => {
		try {
			set({ loading: true, error: null });
			const user = await Auth.signIn(username, password);
			console.log("uuuuser:", user);

			// TO COMPLETE NEW PASSWORD (AFTER FORGOT PASSWORD)
			// if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
			//   const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
			//   Auth.completeNewPassword(
			//     user, // the Cognito User Object
			//     newPassword, // the new password
			//     // OPTIONAL, the required attributes
			//     {
			//       email: 'xxxx@example.com',
			//       phone_number: '1234567890',
			//     }
			//   )
			//     .then((user) => {
			//       // at this time the user is logged in if no MFA required
			//       console.log(user);
			//     })
			//     .catch((e) => {
			//       console.log(e);
			//     });
			// } else {
			//   // other situations
			// }
			set({ user });
			return user;
		} catch (error: any) {
			console.log("error.message:", error.message);
			set({ error: error.message });
		} finally {
			set({ loading: false });
		}
	},
	signOut: async () => {
		try {
			//signout from all devices
			// const signedOut = await Auth.signOut({ global: true });
			await Auth.signOut();
			set({ user: null });
			return true;
		} catch (error) {
			set({ error });
			console.log("error signing out: ", error);
			return false;
		}
	},

	deleteUser: async () => {
		try {
			const result = await Auth.deleteUser();
			console.log(result);
			if (result === "SUCCESS") set({ user: null });
		} catch (error) {
			set({ error });
			console.log("Error deleting user", error);
		}
	},
	resendEmailVerify: async function (user: any) {
		await Auth.resendSignUp(user.username);
	},
}));

export default useUserStore;
