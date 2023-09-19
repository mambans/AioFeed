import React, { useEffect, useState } from "react";
import { CheckBoxContainer } from "./styles";

interface CheckBoxProps {
	checked: boolean;
	label?: string;
	onChange: (checked: boolean) => void;
	icons?: {
		checked?: JSX.Element;
		unchecked?: JSX.Element;
	};
}

const CheckBox = ({ checked: propsChecked, label, onChange, icons }: CheckBoxProps) => {
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

	return (
		<CheckBoxContainer onClick={handleCheck}>
			<input type="checkbox" checked={checked} />
			<label className="cbx">
				<span className="cbs">
					<svg width="12px" height="10px" viewBox="0 0 12 10">
						<polyline points="1.5 6 4.5 9 10.5 1"></polyline>
					</svg>
				</span>
				{/* <span>Checkbox</span> */}
			</label>
		</CheckBoxContainer>
	);
};
export default CheckBox;
