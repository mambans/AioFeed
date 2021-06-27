import { useLayoutEffect } from 'react';
import './useLockBodyScroll.scss';

const useLockBodyScroll = (show = false) => {
  useLayoutEffect(() => {
    show && document.body.setAttribute('popup-open', true);

    return () => document.body.removeAttribute('popup-open');
  }, [show]);
};
export default useLockBodyScroll;
