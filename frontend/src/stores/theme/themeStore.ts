import { create } from "zustand";
import * as dark from "../../themes/dark.json";
import { setLocalStorage } from "../../utilities";

const rgba = (color: string, alpha: number) => {
	if (!color) return null;

	if (color.includes("#")) {
		const [r, g, b] = color?.match(/\w\w/g)?.map((x) => parseInt(x, 16)) || [];
		return `rgba(${r},${g},${b},${alpha})`;
	}
	if (!color.includes("rgba") && color.includes("rgb")) {
		const [r, g, b] = color?.match(/\d+/g) || [];
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	return color;
};

interface ColorType {
	[key: string]: string;
}

export interface ThemeType {
	colors: ColorType;
	// rgba: () => string;
	borderRadius: string | number;
}

interface ThemeStore {
	theme: ThemeType;
	setTheme: (title: string) => void;
	name: string;
}

const useThemeStore = create<ThemeStore>((set, get) => ({
	theme: (() => {
		switch (get()?.name) {
			case "light":
				return { ...dark, rgba };
			case "dark":
			default:
				return { ...dark, rgba };
		}
	})(),
	name: "dark",
	setTheme: (name) =>
		set(() => {
			setLocalStorage("theme", name);
			return { name };
		}),
}));

export default useThemeStore;
