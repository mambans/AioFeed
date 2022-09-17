import moment from 'moment';
import { toast } from 'react-toastify';

export const RemoveCookie = (cookieName) => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const AddCookie = (cookieName, value, options = {}) => {
  const optionsEntries = Object.entries(options);
  document.cookie = `${cookieName}=${value}; ${optionsEntries
    ?.map((i) => `${i[0]}=${i[1]}`)
    ?.join('; ')}${optionsEntries && optionsEntries.length ? '; ' : ''}path=/; SameSite=Lax`;
};

export const getCookie = (cname) => {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      if (c.substring(name.length, c.length) === 'null') {
        return null;
      } else if (c.substring(name.length, c.length) === 'false') {
        return false;
      } else if (c.substring(name.length, c.length) === 'true') {
        return true;
      }

      return c.substring(name.length, c.length);
    }
  }
  return null;
};

export const getLocalstorage = (name) => {
  const item = localStorage.getItem(name);
  try {
    const itemParsed = JSON.parse(item);

    if (itemParsed === 'null') return null;
    if (itemParsed === 'NaN') return NaN;
    if (itemParsed === 'undefined') return undefined;
    return itemParsed;
  } catch (error) {
    if (item === 'null') return null;
    if (item === 'NaN') return NaN;
    if (item === 'undefined') return undefined;
    return item;
  }
};

export const setLocalStorage = (name, data) => {
  try {
    localStorage.setItem(name, typeof finallValue === 'string' ? data : JSON.stringify(data));
    return data;
  } catch (error) {
    console.warn(`setLocalStorage - ${name}: `, error);
  }
};

export const truncate = (input, max) => {
  if (input && input.length > max) return input.substring(0, max) + '..';
  return input;
};

export const chunk = (array, size) => {
  if (array?.length <= size) return [array];
  const chunked_arr = [];
  let index = 0;
  while (index < array.length) {
    chunked_arr.push(array.slice(index, size + index));
    index += size;
  }
  return chunked_arr;
};

export const imageAspectDimensions = ({ width, height, ar }) => {
  const calcDimen = height ? height * ar : width / ar;

  if (height) return { height, width: calcDimen };
  if (width) return { width, height: calcDimen };
};

export const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

export const askForBrowserNotificationPermission = async () => {
  if (Notification && Notification.permission === 'default') {
    const result = await Notification.requestPermission();
    console.log('Notifications: ', result);
    if (result === 'granted') toast.success('Notifications allowed');
    if (result === 'denied') toast.success('Notifications blocked');
    return result;
  }
};

// export const msToHMS = (ms) => {
//   const duration = moment.duration(ms);
//   const hours = duration.hours() ? `${duration.hours()}h` : '';
//   const minutes = duration.minutes() || duration.minutes() ? ` ${duration.minutes()}m` : '';
//   const seconds = duration.seconds() ? ` ${duration.seconds()}s` : '';
//   const HMS = `${hours}${minutes}${seconds}`;
//   return HMS;
// };

export const msToHMS = (ms) => {
  if (!ms) return '-';
  const duration = moment.duration(ms);

  const hm = duration
    .format('h[h] m[m] s[s]')
    //removes suffixes if there are 0 or nothing
    .replace(' h', 'h')
    .replace(' m', 'm')
    .replace(' 0m', '')
    .replace(' 0s', '');
  if (!hm) return duration.format('s [s]');
  return hm;
  // console.log('duration:', duration);
  // const days = duration.hours() ? `${duration.hours()}h` : '';
  // const hours = duration.hours() ? `${duration.hours()}h` : '';
  // console.log('hours:', hours);
  // const minutes = duration.minutes() || duration.minutes() ? ` ${duration.minutes()}m` : '';
  // console.log('minutes:', minutes);
  // const seconds = duration.seconds() ? ` ${duration.seconds()}s` : '';
  // console.log('seconds:', seconds);
  // const HMS = `${hours}${minutes}${seconds}`;
  // return HMS;
};

export const getUniqueListByNoMerge = (arr, key) => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};

export const getUniqueListBy = (arr, key) => {
  if (!arr) return [];
  return arr.reduce((acc, item) => {
    const foundIndex = acc.findIndex((i) => i[key] === item[key]);
    if (foundIndex >= 0 && item) {
      acc[foundIndex] = { ...acc[foundIndex], ...item };
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);
};
