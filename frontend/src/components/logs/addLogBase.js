import { getLocalstorage } from '../../util';

const addLogBase = (n) => {
  try {
    if (n && Object.prototype.toString.call(n) === '[object Object]') {
      const current = getLocalstorage('logs') || [];
      const currentUnreadCount = getLocalstorage('logsUnreadCount') || 0;
      localStorage.setItem(
        'logs',
        JSON.stringify([{ date: new Date().toISOString(), ...(n || {}) }, ...current].slice(0, 100))
      );
      console.log('currentUnreadCount:', currentUnreadCount);
      console.log('parseInt(currentUnreadCount) + 1:', parseInt(currentUnreadCount) + 1);
      localStorage.setItem('logsUnreadCount', parseInt(currentUnreadCount) + 1);
    }
  } catch (error) {}
  return;
};
export default addLogBase;
