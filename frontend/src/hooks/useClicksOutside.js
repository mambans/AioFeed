import { useEffect } from 'react';

export default (ref, func, mount = true) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (Array.isArray(ref) && ref?.length >= 1) {
        if (ref.every((ele) => ele?.current && !ele?.current.contains(event.target))) {
          func(event);
        }
      } else if (ref?.current && !ref?.current.contains(event.target)) func(event);
    };

    if (mount) document.addEventListener('mouseup', handleClickOutside);
    return () => document.removeEventListener('mouseup', handleClickOutside);
  }, [ref, func, mount]);
};
