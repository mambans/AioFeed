import { useState, useCallback } from 'react';
import { AddCookie, getCookie, RemoveCookie } from '../util';

/**
 * Save in browser cookies
 * @param {string} key - Name of the cookie.
 * @param {any} defaultValue - Value to save for the cookie.
 * @param {object} options - Options object for the cookie
 * @returns
 */
const useCookiesState = (key, defaultValue, options) => {
  const [value, setValue] = useState(() => getCookie(key) || defaultValue);

  const setCookieValue = useCallback(
    (newValue) => {
      setValue((currentValue) => {
        const finallValue = typeof newValue === 'function' ? newValue(currentValue) : newValue;
        try {
          if (finallValue) {
            AddCookie(key, finallValue, options);
          } else {
            RemoveCookie(key);
          }
        } catch (error) {
          console.log('useCookiesState error:', error);
        }
        return finallValue;
      });
    },
    [key, options]
  );

  return [value, setCookieValue];
};
export default useCookiesState;
