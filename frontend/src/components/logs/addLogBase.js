import { getLocalstorage } from '../../util';

const addLogBase = (n) => {
  if (n) {
    const current = getLocalstorage('logs');
    localStorage.setItem(
      'logs',
      JSON.stringify([...current, { date: new Date().toISOString(), ...n }].slice(0, 100))
    );
  }
};
export default addLogBase;
