import React, { useEffect, useState } from "react";

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
		<div>
			{label && <label>{label}</label>}
			<input type="checkbox" checked={checked} onChange={handleCheck} />
			{icons?.checked}
		</div>
	);
};
export default CheckBox;
