import { useState, ChangeEvent } from "react";

type InputType = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";

interface Options {
	type?: InputType;
	trim?: boolean;
}

type ValueChangeEvent = string | number | ChangeEvent<HTMLInputElement> | null | undefined | boolean;

const useInput = (
	initialValue: any,
	options: Options | null = { type: typeof initialValue || "string", trim: false },
	onChange?: (value: ValueChangeEvent) => void
) => {
	const [value, setValue] = useState<any>(initialValue);
	const [checked, setChecked] = useState<boolean>(initialValue);
	const [error, setError] = useState<Error | undefined>(undefined);

	return {
		value,
		setValue,
		checked,
		setChecked,
		reset: (value = null) => {
			setValue(value || (options?.type === "number" ? 0 : ""));
			setChecked(value || false);
		},
		manualSet: {
			onClick: (event: any) => {
				setValue(
					options?.type === "number" ? parseInt(event.target.textContent.replace(/ +(?= )/g, "")) : event.target.textContent.replace(/ +(?= )/g, "")
				);
				setChecked((prevChecked) => !prevChecked);
			},
		},
		bind: {
			value,
			checked,
			onChange: function (event: ValueChangeEvent) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				/*@ts-ignore*/
				event?.preventDefault?.();
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				/*@ts-ignore*/
				event?.stopPropagation?.();

				const val = (() => {
					if (typeof event === "string" || typeof event === "number" || !event) return event;
					if (typeof event === "boolean") return event;

					return (event as ChangeEvent<HTMLInputElement>).target?.value;
				})();

				onChange?.(val);

				const v = options?.type === "number" ? parseInt((val as string).replace(/ +(?= )/g, "")) : (val as string)?.replace?.(/ +(?= )/g, "");

				setValue(options?.trim && typeof v !== "number" ? v.trim() : v);
				setChecked(!!val);
			},
		},
		setError,
		error,
	};
};

export default useInput;
