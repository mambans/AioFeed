import { useState, useEffect } from "react";

/**
 * Save in localstorage and sync state across multipul tabs/windows.
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
    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [key]);

  const setLocalStateValue = (newValue) => {
    setValue((currentValue) => {
      const finallValue = typeof newValue === "function" ? newValue(currentValue) : newValue;
      localStorage.setItem(
        key,
        typeof finallValue === "string" ? finallValue : JSON.stringify(finallValue)
      );
      return finallValue;
    });
  };

  return [value, setLocalStateValue];
};
