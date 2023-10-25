import React, { useRef, useEffect } from "react";

import { StyledToggleButton } from "./StyledComponents";

const ToggleButton = ({ setEnable, enabled, label, tooltip, icon, buttonsperrow, scrollIntoView, smallerIcons, serviceName, disabled }) => {
	// const [checked, setChecked] = useState(enabled || false);
	const timeout = useRef();

	function handleChange() {
		console.log("ToggleButton onclick:");
		const newEnabled = !enabled;
		setEnable(newEnabled);
		clearTimeout(timeout.current);
		if (scrollIntoView && newEnabled === true) {
			timeout.current = setTimeout(() => {
				const element = document.getElementById(`${label || serviceName}Header`);
				element && element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
			}, 150);
		}
	}

	useEffect(() => {
		return () => {
			clearTimeout(timeout.current);
		};
	}, []);

	return (
		<StyledToggleButton
			onClick={handleChange}
			disabled={disabled}
			variant="dark"
			buttonsperrow={buttonsperrow}
			enabled={String(enabled)}
			tooltip={tooltip}
		>
			{icon}
			{React.Children?.map(smallerIcons, (icon) => (React.isValidElement(icon) ? React.cloneElement(icon, { className: "smallIcon" }) : icon))}
		</StyledToggleButton>
	);
};

export default ToggleButton;
