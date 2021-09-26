import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Save in localstorage.
 * @param {string} key - Name of the localstorage.
 * @param {any} value - Value to save for the localstorage.
 * @returns
 */
const useLocalStorageState = (key, defaultValue) => {
  const previousKey = useRef(key);
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    try {
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      return storedValue || defaultValue;
    }
  });

  const setLocalStateValue = useCallback(
    (newValue, updateLocalstorage = true) => {
      setValue((currentValue) => {
        const finallValue = typeof newValue === 'function' ? newValue(currentValue) : newValue;
        try {
          if (updateLocalstorage) {
            localStorage.setItem(
              key,
              typeof finallValue === 'string' ? finallValue : JSON.stringify(finallValue)
            );
          }
        } catch (error) {
          console.log('Localstorage error:', error);
        }
        return finallValue;
      });
    },
    [key]
  );

  useEffect(() => {
    if (previousKey.current !== key) {
      setValue(() => {
        const storedValue = localStorage.getItem(key);
        previousKey.current = key;

        try {
          if (storedValue) return JSON.parse(storedValue);
        } catch (error) {
          return storedValue || defaultValue;
        }
      });
    }
  }, [key, defaultValue, previousKey]);

  return [value, setLocalStateValue];
};
export default useLocalStorageState;
