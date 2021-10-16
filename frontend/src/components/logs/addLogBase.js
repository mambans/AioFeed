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
      try {
        const parsed = parseInt(JSON.parse(currentUnreadCount));
        if (typeof parsed === 'number') {
          localStorage.setItem('logsUnreadCount', parsed + 1);
        }
        localStorage.setItem('logsUnreadCount', 1);
      } catch (error) {
        localStorage.setItem('logsUnreadCount', 1);
      }
    }
  } catch (error) {}
  return;
};
export default addLogBase;
