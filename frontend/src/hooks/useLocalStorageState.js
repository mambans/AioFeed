import { useState, useCallback, useRef, useEffect } from 'react';
import { getLocalstorage, setLocalStorage } from '../util';

/**
 * Save in localstorage.
 * @param {string} key - Name of the localstorage.
 * @param {any} value - Value to save for the localstorage.
 * @returns
 */
const useLocalStorageState = (key, defaultValue) => {
  const previousKey = useRef(key);
  const [value, setValue] = useState(() => {
    try {
      const storedValue = getLocalstorage(key);
      return storedValue ?? defaultValue;
    } catch (error) {
      return defaultValue;
    }
  });

  const setLocalStateValue = useCallback(
    (newValue, updateLocalstorage = true) => {
      setValue((currentValue) => {
        const finallValue = typeof newValue === 'function' ? newValue(currentValue) : newValue;
        try {
          if (updateLocalstorage) {
            setLocalStorage(key, finallValue);
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
        try {
          const storedValue = getLocalstorage(key);
          previousKey.current = key;
          return storedValue ?? defaultValue;
        } catch (error) {
          return defaultValue;
        }
      });
    }
  }, [key, defaultValue, previousKey]);

  return [value, setLocalStateValue];
};
export default useLocalStorageState;
