import React, { useEffect, useState } from "react";
import { CheckBoxContainer } from "./styles";
import ToolTip from "../tooltip/ToolTip";

interface CheckBoxProps {
	checked: boolean;
	label?: string;
	onChange: (checked: boolean) => void;
	icons?: {
		checked?: JSX.Element;
		unchecked?: JSX.Element;
	};

	style?: React.CSSProperties;
	tooltip?: string;
}

const CheckBox = ({ checked: propsChecked, label, onChange, icons, style, tooltip }: CheckBoxProps) => {
	const [checked, setChecked] = useState(propsChecked);

	useEffect(() => {
		setChecked(propsChecked);
	}, [propsChecked]);

	const handleCheck = () => {
		setChecked((c) => {
			const checked = !c;

			onChange(checked);
			return checked;
		});
	};

	const box = (
		<>
			<input type="checkbox" checked={checked} readOnly />
			<label className="cbx">
				<span className="cbs">
					<svg width="12px" height="10px" viewBox="0 0 12 10">
						<polyline points="1.5 6 4.5 9 10.5 1"></polyline>
					</svg>
				</span>
			</label>
		</>
	);

	const content = (
		<CheckBoxContainer onClick={handleCheck} style={style}>
			{checked && (icons?.checked || box)}
			{!checked && (icons?.unchecked || box)}
		</CheckBoxContainer>
	);

	if (tooltip) return <ToolTip tooltip={tooltip}>{content}</ToolTip>;

	return content;
};
export default CheckBox;
