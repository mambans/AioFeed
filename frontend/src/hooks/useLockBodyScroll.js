import { useLayoutEffect } from 'react';
import './useLockBodyScroll.scss';

export default (show = false) => {
  useLayoutEffect(() => {
    show && document.body.setAttribute('popup-open', true);

    return () => document.body.removeAttribute('popup-open');
  }, [show]);
};
