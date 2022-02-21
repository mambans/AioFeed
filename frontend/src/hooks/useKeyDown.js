import { useEffect, useState } from 'react';

const useKeyDown = (targetKey, defaultValue, mount = true) => {
  const [keyPressed, setKeyPressed] = useState(defaultValue);

  useEffect(() => {
    const downHandler = ({ key }) => {
      if ([targetKey].flat().includes(key)) {
        setKeyPressed(true);
      }
    };
    const upHandler = ({ key }) => {
      if ([targetKey].flat().includes(key)) {
        setKeyPressed(false);
      }
    };

    if (mount) {
      window.addEventListener('keydown', downHandler);
      window.addEventListener('keyup', upHandler);
    }

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey, mount]);

  return keyPressed;
};
export default useKeyDown;
