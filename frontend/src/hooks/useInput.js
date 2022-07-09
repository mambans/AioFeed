import { useState } from 'react';

/**
 * @param {any} initialValue - Start value
 * @returns
 */
const useInput = (initialValue, options = { type: 'string' }) => {
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
      onChange: (event) => {
        console.log('eventttt:', event);
        event?.preventDefault();
        event?.stopPropagation();
        setValue(
          options?.type === 'number'
            ? parseInt(event?.target?.value?.replace(/ +(?= )/g, ''))
            : event?.target?.value?.replace(/ +(?= )/g, '')
        );
      },
    },
    setError,
    error,
  };
};
export default useInput;
