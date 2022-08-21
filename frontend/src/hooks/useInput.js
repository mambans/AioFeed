import { useState } from 'react';

/**
 * @param {any} initialValue - Start value
 * @returns
 */
const useInput = (initialValue, options = { type: 'string', trim: false }, onChange) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState();

  return {
    value,
    setValue,
    reset: () => setValue(options?.type === 'number' ? 0 : ''),
    manualSet: {
      onClick: (event) =>
        setValue(
          options?.type === 'number'
            ? parseInt(event.target.textContent.replace(/ +(?= )/g, ''))
            : event.target.textContent.replace(/ +(?= )/g, '')
        ),
    },
    bind: {
      value,
      onChange: function (event) {
        event?.preventDefault?.();
        event?.stopPropagation?.();
        const val = (() => {
          if (typeof event === 'string' || typeof event === 'number' || !event) return event;
          return event?.target?.value;
        })();
        onChange?.(val);
        const v =
          options?.type === 'number'
            ? parseInt(val?.replace(/ +(?= )/g, ''))
            : val?.replace(/ +(?= )/g, '');
        setValue(options.trim ? v.trim() : v);
      },
    },
    setError,
    error,
  };
};
export default useInput;
