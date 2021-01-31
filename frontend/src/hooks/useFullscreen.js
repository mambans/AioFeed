import { useContext, useEffect } from 'react';
import NavigationContext from '../components/navigation/NavigationContext';

export default ({ hideNavbar = true } = {}) => {
  const { setVisible, setFooterVisible, setShrinkNavbar } = useContext(NavigationContext);

  useEffect(() => {
    setShrinkNavbar('true');
    setFooterVisible(false);
    document.documentElement.style.overflow = 'hidden';
    if (hideNavbar) setVisible(false);

    return () => {
      document.documentElement.style.overflow = 'visible';
      setShrinkNavbar('false');
      setFooterVisible(true);
      if (hideNavbar) setVisible(true);
    };
  }, [setShrinkNavbar, setFooterVisible, hideNavbar, setVisible]);
};
