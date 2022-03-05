import { useEffect } from 'react';

const CleanUp = () => {
  useEffect(() => {
    try {
      console.log('CleanUp:');
      localStorage.removeItem('TwitchChatState');
    } catch (error) {}
  }, []);

  return null;
};
export default CleanUp;