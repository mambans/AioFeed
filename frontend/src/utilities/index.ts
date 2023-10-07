import Cookies from "js-cookie";
import moment from "moment";
import { toast } from "react-toastify";
import durationMsToDate from "./durationMsToDate";
import loginNameFormat from "./loginNameFormat";

export const RemoveCookie = (cookieName: string) => {
	Cookies.remove(cookieName);
};

export const AddCookie = (cookieName: string, value: string, options = {}) => {
	Cookies.set(cookieName, value, options);
};

export const getCookie = (cname: string) => {
	const cookie = Cookies.get(cname);
	if (cookie === "null") {
		return null;
	} else if (cookie === "false") {
		return false;
	} else if (cookie === "true") {
		return true;
	}

	return cookie;
};

export const getLocalstorage = (name: string) => {
	const item: any = localStorage.getItem(name);
	try {
		const itemParsed = JSON.parse(item);

		if (itemParsed === "null") return null;
		if (itemParsed === "NaN") return NaN;
		if (itemParsed === "undefined") return undefined;
		return itemParsed;
	} catch (error) {
		if (item === "null") return null;
		if (item === "NaN") return NaN;
		if (item === "undefined") return undefined;
		return item;
	}
};

export const setLocalStorage = (name: string, data: any) => {
	try {
		localStorage.setItem(name, typeof data === "string" ? data : JSON.stringify(data));
		return data;
	} catch (error) {
		console.warn(`setLocalStorage - ${name}: `, error);
	}
};

export const truncate = (input: string, max: number) => {
	if (input && input.length > max) return input.substring(0, max) + "..";
	return input;
};

export const chunk = (array: any[], size: number) => {
	if (array?.length <= size) return [array];
	const chunked_arr: any[] = [];
	let index = 0;
	while (index < array.length) {
		chunked_arr.push(array.slice(index, size + index));
		index += size;
	}
	return chunked_arr;
};

export const imageAspectDimensions = ({ width, height, ar }: { width: number; height: number; ar: number }) => {
	const calcDimen = height ? height * ar : width / ar;

	if (height) return { height, width: calcDimen };
	if (width) return { width, height: calcDimen };
};

export const convertArrayToObject = (array: any[], key: string) => {
	const initialValue = {};
	return array.reduce((obj, item) => {
		return {
			...obj,
			[item[key]]: item,
		};
	}, initialValue);
};

export const askForBrowserNotificationPermission = async () => {
	if (Notification && Notification.permission === "default") {
		const result = await Notification.requestPermission();
		console.log("Notifications: ", result);
		if (result === "granted") toast.success("Notifications allowed");
		if (result === "denied") toast.success("Notifications blocked");
		return result;
	}
};

export const msToHMS = (ms: number) => {
	if (!ms) return "-";
	const duration = moment.duration(ms);

	const hm = duration
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		?.format("h[h] m[m] s[s]")
		//removes suffixes if there are 0 or nothing
		.replace(" h", "h")
		.replace(" m", "m")
		.replace(" 0m", "")
		.replace(" 0s", "");
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	if (!hm) return duration.format("s [s]");
	return hm;
};

export const getUniqueListByNoMerge = (arr: any[], key: string) => {
	return [...new Map(arr.map((item) => [item[key], item])).values()];
};

// export const getUniqueListBy = (arr: any[], key: string) => {
// 	if (!arr) return [];
// 	return arr.reduce((acc, item) => {
// 		const foundIndex = acc.findIndex((i: any) => i[key] === item[key]);
// 		if (foundIndex >= 0 && item) {
// 			acc[foundIndex] = { ...acc[foundIndex], ...item };
// 		} else {
// 			acc.push({ ...item });
// 		}
// 		return acc;
// 	}, []);
// };

export const getUniqueListBy = (arr: any[], key: string) => {
	if (!arr) return [];

	const uniqueMap = new Map();

	arr.forEach((item) => {
		const keyValue = item[key];

		if (keyValue !== undefined) {
			if (!uniqueMap.has(keyValue)) {
				uniqueMap.set(keyValue, { ...item });
			} else {
				uniqueMap.set(keyValue, { ...uniqueMap.get(keyValue), ...item });
			}
		}
	});

	return Array.from(uniqueMap.values());
};

export { durationMsToDate, loginNameFormat };
