import { useState, useEffect, useCallback } from 'react';
import { getLocalstorage, setLocalStorage } from '../util';

/**
 * Save in localstorage and sync state across multipul tabs/windows.
 * @param {string} key - Name of the localstorage.
 * @param {any} defaultValue - Default value for the localstorage.
 * @returns
 */
const useSyncedLocalState = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = getLocalstorage(key);
    try {
      // if (storedValue === 'null') return null;
      // if (storedValue === 'NaN') return NaN;
      // if (storedValue === 'undefined') return undefined;
      return storedValue ?? defaultValue;
    } catch (error) {
      return storedValue ?? defaultValue;
    }
  });

  // useEffect(() => {
  //   const listener = (e) => {
  //     if (e.storageArea === localStorage && e.key === key) {
  //       try {
  //         const newVal = e.newValue;
  //         if (newVal === 'null' || newVal === 'nNaNull' || newVal === 'undefined') setValue();
  //         setValue(JSON.parse(newVal));
  //       } catch (error) {
  //         setValue(e.newValue);
  //       }
  //     }
  //   };
  //   window.addEventListener('storage', listener);

  //   return () => window.removeEventListener('storage', listener);
  // }, [key]);

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

  return [value, setLocalStateValue];
};
export default useSyncedLocalState;
