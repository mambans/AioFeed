import { useEffect } from "react";
import { useSetNavigationBarVisible } from "../stores/navigation";

const useFullscreen = ({ hideNavbar = true } = {}) => {
	const setNavigationBarVisible = useSetNavigationBarVisible();

	useEffect(() => {
		document.documentElement.style.overflow = "hidden";
		if (hideNavbar) setNavigationBarVisible(false);

		return () => {
			document.documentElement.style.removeProperty("overflow");

			if (hideNavbar) setNavigationBarVisible(true);
		};
	}, [hideNavbar, setNavigationBarVisible]);
};
export default useFullscreen;
