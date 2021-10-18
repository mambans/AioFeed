import { getLocalstorage, setLocalStorage } from '../../util';

const addLogBase = (n) => {
  try {
    if (n && Object.prototype.toString.call(n) === '[object Object]') {
      const current = getLocalstorage('logs') || [];
      const currentUnreadCount = getLocalstorage('logsUnreadCount') || 0;
      setLocalStorage(
        'logs',
        [{ date: new Date().toISOString(), ...(n || {}) }, ...current].slice(0, 100)
      );

      try {
        const parsed = parseInt(JSON.parse(currentUnreadCount));
        if (typeof parsed === 'number') {
          setLocalStorage('logsUnreadCount', parsed + 1);
        }
        setLocalStorage('logsUnreadCount', 1);
      } catch (error) {
        setLocalStorage('logsUnreadCount', 1);
      }
    }
  } catch (error) {}
  return;
};
export default addLogBase;
