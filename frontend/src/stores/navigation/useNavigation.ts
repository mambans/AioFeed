import { create } from "zustand";

const useNavigationStore = create<any>((set, get) => ({
		navigationSidebarVisible: false,
	navigationBarVisible: true,
	key: null,
	data: null,
	setNavigationSidebarVisible: (navigationSidebarVisible: boolean, key: string | null) => set(() => ({ navigationSidebarVisible, key })),
	setNavigationBarVisible: (navigationBarVisible: boolean) => set(() => ({ navigationBarVisible })),
	setNavigationKey: (key: string) => set(() => ({ key })),
	setNavigationData: (data: any) => set(() => ({ data })),
}));

const useNavigationSidebarVisible = () => useNavigationStore((state) => state.navigationSidebarVisible);
const useNavigationBarVisible = () => useNavigationStore((state) => state.navigationBarVisible);
const useSetNavigationSidebarVisible = () => useNavigationStore((state) => state.setNavigationSidebarVisible);
const useSetNavigationBarVisible = () => useNavigationStore((state) => state.setNavigationBarVisible);
const useNavigationKey = () => useNavigationStore((state) => state.key);
const useSetNavigationKey = () => useNavigationStore((state) => state.setNavigationKey);
const useNavigationData = () => useNavigationStore((state) => state.data);
const useSetNavigationData = () => useNavigationStore((state) => state.setNavigationData);

export {
	useNavigationSidebarVisible,
	useNavigationBarVisible,
	useSetNavigationSidebarVisible,
	useSetNavigationBarVisible,
	useNavigationKey,
	useSetNavigationKey,
	useNavigationData,
	useSetNavigationData,
};
