import React, { useCallback, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import useLocalStorageState from "../../hooks/useLocalStorageState";
import API from "../navigation/API";
import useUserStore from "../../stores/userStore";

const TwitterContext = React.createContext();

export const TwitterProvider = ({ children }) => {
	const { user } = useUserStore();
	const [pref, setPref] = useLocalStorageState("TwitterPreferences", {}) || {};
	const [twitterLists, setTwitterLists] = useLocalStorageState("Twitter-Lists");
	const invoked = useRef(false);
	const toggle = (i, v) => setPref((c) => ({ ...c, [i]: v || !c[i] }));

	const fetchTwitterContextData = useCallback(async () => {
		const { lists } = await API.getTwitterLists()
			.then((res) => res?.data?.Item || {})
			.catch((e) => {
				console.error("Twitter context useEffect error: ", e);
				toast.error(e.message);
				return {};
			});

		setTwitterLists(lists, invoked.current);
		invoked.current = true;
	}, [setTwitterLists]);

	useEffect(() => {
		if (user && !invoked.current) fetchTwitterContextData();
	}, [fetchTwitterContextData, user]);

	return (
		<TwitterContext.Provider
			value={{
				twitterLists,
				setTwitterLists,
				fetchTwitterContextData,
				toggleRefreshOnFocus: (v) => toggle("refresh_on_focus", v),
				refreshOnFocusEnabled: Boolean(pref.refresh_on_focus),
			}}
		>
			{children}
		</TwitterContext.Provider>
	);
};

export default TwitterContext;
