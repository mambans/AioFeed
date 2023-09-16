import { create } from "zustand";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Amplify, Auth, Hub, Logger } from "aws-amplify";
import { useEffect } from "react";

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
	user?: UserType | null;
	loading: boolean;
	loaded: boolean;
	error: string | null | undefined | any;
	setUser: (user: UserType) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null | undefined | any) => void;
	initialFetch: () => void;

	signIn: ({ username, password }: { username: string; password: string }) => void;
	signOut: () => void;
	deleteUser: () => void;
	resendEmailVerify: () => Promise<void>;
}

const useUserStore = create<UserStore>((set, get) => ({
	user: null,
	loaded: false,
	loading: true,
	error: null,

	setUser: (user) => set(() => ({ user })),
	setError: (error) => set(() => ({ error })),
	setLoading: (loading) => set(() => ({ loading })),
	initialFetch: async () => {
		if (!get().loaded) {
			console.log("initialFetch useUser");
			set({ loading: true, loaded: true });
			try {
				const result = await Auth.currentAuthenticatedUser();
				set({ user: result, error: null });
				return null;
			} catch (error: any) {
				console.log("error:", error);
				set({ error });
				return null;
			} finally {
				set({ loading: false });
			}
		}
	},

	signIn: async ({ username, password }) => {
		try {
			set({ loading: true, error: null });
			const user = await Auth.signIn(username, password);

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
	resendEmailVerify: async function () {
		await Auth.resendSignUp(get().user!.username);
	},
}));

const useUser = () => {
	const user = useUserStore((state) => state.user);
	const initialFetch = useUserStore((state) => state.initialFetch);

	useEffect(() => {
		initialFetch();
	}, [initialFetch]);

	return user;
};

const useUserSetUser = () => useUserStore((state) => state.setUser);
const useUserLoading = () => useUserStore((state) => state.loading);
const useUserError = () => ({
	error: useUserStore((state) => state.error),
	setError: useUserStore((state) => state.setError),
});
const useUserSignIn = () => useUserStore((state) => state.signIn);
const useUserSignOut = () => useUserStore((state) => state.signOut);
const useUserDelete = () => useUserStore((state) => state.deleteUser);
const useUserResendEmailVerify = () => useUserStore((state) => state.resendEmailVerify);

export { useUser, useUserLoading, useUserError, useUserSignIn, useUserSignOut, useUserDelete, useUserResendEmailVerify, useUserSetUser };
