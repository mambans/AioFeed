import { useState, useEffect, useCallback } from 'react';
import { getCookie } from '../util';

/**
 * Save in localstorage and sync state across multipul tabs/windows.
 * @param {string} key - Name of the localstorage.
 * @param {any} value - Value to save for the localstorage.
 * @returns
 */
const useSyncedLocalState = (key, defaultValue) => {
  const [value, setValue] = useState(getCookie(key));

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

    browser.cookies.onChanged.addListener(listener);

    return () =>{
      browser.cookies.onChanged.removeListener(listener)
  }, [key]);

  const setLocalStateValue = useCallback(
    (newValue) => {
      setValue((currentValue) => {
        const finallValue = typeof newValue === 'function' ? newValue(currentValue) : newValue;
        try {
          localStorage.setItem(
            key,
            typeof finallValue === 'string' ? finallValue : JSON.stringify(finallValue)
          );
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
