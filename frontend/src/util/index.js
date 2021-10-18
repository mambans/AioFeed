export const RemoveCookie = (cookieName) => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const AddCookie = (cookieName, value, options = {}) => {
  document.cookie = `${cookieName}=${value}; ${Object.entries(options)
    .map((i) => `${i[0]}=${i[1]}`)
    .join('; ')}  path=/;  SameSite=Lax`;
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
