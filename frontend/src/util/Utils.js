export const RemoveCookie = (cookieName) => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const AddCookie = (cookieName, value) => {
  document.cookie = `${cookieName}=${value}; path=/; SameSite=Lax`;
};
