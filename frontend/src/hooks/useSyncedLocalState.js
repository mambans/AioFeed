import { useState, useEffect, useCallback } from 'react';

/**
 * Save in localstorage and sync state across multipul tabs/windows.
 * @param {string} key - Name of the localstorage.
 * @param {any} value - Value to save for the localstorage.
 * @returns
 */
const useSyncedLocalState = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    try {
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      return storedValue || defaultValue;
    }
  });

  useEffect(() => {
    const listener = (e) => {
      if (e.storageArea === localStorage && e.key === key) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch (error) {
          setValue(e.newValue);
        }
      }
    };
    window.addEventListener('storage', listener);

    return () => window.removeEventListener('storage', listener);
  }, [key]);

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

  return [value, setLocalStateValue];
};
export default useSyncedLocalState;
