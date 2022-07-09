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
      onChange: function (event) {
        console.log('eventttt:', event);
        event?.preventDefault();
        event?.stopPropagation();
        const v =
          options?.type === 'number'
            ? parseInt(event?.target?.value?.replace(/ +(?= )/g, ''))
            : event?.target?.value?.replace(/ +(?= )/g, '');
        console.log('v:', v);
        setValue(v);

        setTimeout(() => {
          console.log('value:', value);
        }, 100);
      },
    },
    setError,
    error,
  };
};
export default useInput;
