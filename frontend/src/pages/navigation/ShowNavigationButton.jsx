import React from "react";
import { MdVerticalAlignBottom } from "react-icons/md";
import Button from "../../components/Button";
import { useNavigationBarVisible, useSetNavigationBarVisible } from "../../stores/navigation";

const ShowNavigationButton = ({ text }) => {
	const setNavigationBarVisible = useSetNavigationBarVisible();
	const navigationBarVisible = useNavigationBarVisible();

	const handleOnClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setNavigationBarVisible((c) => !c);
	};

	return (
		<Button onClick={handleOnClick}>
			<MdVerticalAlignBottom
				style={{
					transition: "transform 250ms",
					transform: navigationBarVisible ? "rotateX(180deg)" : "unset",
					right: "10px",
				}}
				size={26}
				title="Toggle navbar"
			/>
			{text}
		</Button>
	);
};
export default ShowNavigationButton;
