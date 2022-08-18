import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { footerVisibleAtom, navigationBarVisibleAtom } from '../pages/navigation/atoms';

const useFullscreen = ({ hideNavbar = true } = {}) => {
  const setFooterVisible = useSetRecoilState(footerVisibleAtom);
  const setNavigationBarVisible = useSetRecoilState(navigationBarVisibleAtom);

  useEffect(() => {
    setFooterVisible(false);
    document.documentElement.style.overflow = 'hidden';
    if (hideNavbar) setNavigationBarVisible(false);

    return () => {
      document.documentElement.style.removeProperty('overflow');
      setFooterVisible(true);
      if (hideNavbar) setNavigationBarVisible(true);
    };
  }, [setFooterVisible, hideNavbar, setNavigationBarVisible]);
};
export default useFullscreen;
