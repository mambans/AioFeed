import { useContext, useEffect } from 'react';
import NavigationContext from '../components/navigation/NavigationContext';

const useFullscreen = ({ hideNavbar = true } = {}) => {
  const { setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);

  useEffect(() => {
    setShrinkNavbar('true');
    setFooterVisible(false);
    document.documentElement.style.overflow = 'hidden';
    if (hideNavbar) setVisible(false);

    return () => {
      document.documentElement.style.removeProperty('overflow');
      setShrinkNavbar('false');
      setFooterVisible(true);
      if (hideNavbar) setVisible(true);
    };
  }, [setShrinkNavbar, setFooterVisible, hideNavbar, setVisible]);
};
export default useFullscreen;
