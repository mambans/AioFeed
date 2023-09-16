import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import useSyncedLocalState from "../../hooks/useSyncedLocalState";
import API from "../navigation/API";
import LogsContext from "../logs/LogsContext";
import { parseNumberAndString } from "./dragDropUtils";
import uniqBy from "lodash/uniqBy";
import { useUser } from "../../stores/user";

const MyListsContext = React.createContext();

export const MyListsProvider = ({ children }) => {
	const user = useUser();
	const { addLog } = useContext(LogsContext);
	const [lists, setLists] = useSyncedLocalState("Mylists", {}) || {};
	const [myListPreferences, setMyListPreferences] = useSyncedLocalState("MylistsPreferences", {}) || {};
	const [isLoading, setIsLoading] = useState();
	const invoked = useRef(false);
	const savedVideosWithData = useRef([]);

	const addSavedData = (newData = []) => {
		const data = [...(savedVideosWithData.current || []), ...newData].filter((i) => i);
		const uniqueData = uniqBy(data, "id");
		savedVideosWithData.current = uniqueData;
	};

	const addList = async (title, item) => {
		const newVideo = item ? (Array.isArray(item) ? item : [parseNumberAndString(item)]) : [];
		const id = Date.now();
		const videos = newVideo.filter((i) => i);
		const newListObj = {
			title,
			id,
			videos,
			enabled: true,
		};

		setLists((curr) => ({ ...curr, [id]: newListObj }));

		setTimeout(() => {
			const list = document.getElementById(title);
			list?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
		}, 0);

		API.createSavedList(id, newListObj);
	};

	const deleteList = async ({ id }) => {
		const title = lists[id]?.title;
		const confirmed = window.confirm(`Delete list ${title}?`);
		if (!confirmed) return false;

		setLists((curr) => {
			const orginialLists = { ...curr };
			delete orginialLists[id];

			return orginialLists;
		});

		await API.deleteSavedList(id);
		addLog({
			title: `${title} list deleted`,
			text: `${title} list deleted`,
			icon: "mylist",
		});
	};

	const editListOrder = async ({ id, videoId, index }) => {
		setLists((curr) => {
			const orginialLists = { ...curr };
			const list = orginialLists[id];
			const currentIndex = list.videos.findIndex((id) => id === videoId);
			const videos = [...list.videos];
			videos.splice(currentIndex, 1);
			videos.splice(index, 0, videoId);

			const newList = { [id]: { ...list, videos } };
			// API.updateSavedList(id, { videos });
			return { ...orginialLists, ...newList };
		});
	};

	const editListName = async ({ id, title }) => {
		setLists((curr) => {
			const orginialLists = { ...curr };
			const list = orginialLists[id];
			const newList = { [id]: { ...list, title } };
			return { ...orginialLists, ...newList };
		});
		API.updateSavedList(id, { title });
	};

	const toggleList = async (id) => {
		setLists((c) => {
			const enabled = !c[id].enabled;
			const obj = {
				...c[id],
				enabled,
			};
			const newList = {
				[id]: obj,
			};
			API.updateSavedList(id, { enabled });
			return {
				...c,
				...newList,
			};
		});
	};

	const fetchMyListContextData = useCallback(async () => {
		setIsLoading(true);
		const { Items } = (await API.getSavedList()) || {};
		const lists = Items?.reduce((acc, curr) => {
			return {
				...acc,
				[curr.id]: curr,
			};
		}, {});

		if (lists) setLists(lists, invoked.current);
		setIsLoading(false);
		invoked.current = true;
	}, [setLists]);

	const checkIfListNameIsAvaliable = useCallback(
		(name) => {
			return !name || !lists || lists.length || (name && !Object.values(lists).find((list) => list.title.toLowerCase() === name.toLowerCase()));
		},
		[lists]
	);

	useEffect(() => {
		if (user && !invoked.current) fetchMyListContextData();
	}, [fetchMyListContextData, user]);

	return (
		<MyListsContext.Provider
			value={{
				lists,
				setLists,
				fetchMyListContextData,
				isLoading,
				setIsLoading,
				myListPreferences,
				setMyListPreferences,
				addList,
				toggleList,
				deleteList,
				editListName,
				checkIfListNameIsAvaliable,
				savedVideosWithData: savedVideosWithData,
				addSavedData,
				editListOrder,
			}}
		>
			{children}
		</MyListsContext.Provider>
	);
};

export default MyListsContext;
