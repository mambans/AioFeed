import { useState, useCallback } from 'react';

/**
 * Save in localstorage.
 * @param {string} key - Name of the localstorage.
 * @param {any} value - Value to save for the localstorage.
 * @returns
 */
export default (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    try {
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      return storedValue || defaultValue;
    }
  });

  const setLocalStateValue = useCallback(
    (newValue) => {
      setValue((currentValue) => {
        const finallValue = typeof newValue === 'function' ? newValue(currentValue) : newValue;
        localStorage.setItem(
          key,
          typeof finallValue === 'string' ? finallValue : JSON.stringify(finallValue)
        );
        return finallValue;
      });
    },
    [key]
  );

  return [value, setLocalStateValue];
};
