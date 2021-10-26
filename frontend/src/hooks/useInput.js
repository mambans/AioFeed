import { useState } from 'react';

/**
 * @param {any} initialValue - Start value
 * @returns
 */
const useInput = (initialValue, options = { type: 'string' }) => {
  const [value, setValue] = useState(initialValue);

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
      onChange: (event) =>
        setValue(
          options?.type === 'number'
            ? parseInt(event.target.value.replace(/ +(?= )/g, ''))
            : event.target.value.replace(/ +(?= )/g, '')
        ),
    },
  };
};
export default useInput;
