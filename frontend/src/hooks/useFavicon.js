import { useEffect, useRef } from 'react';

const useFavicon = (
  faviconHref = `${process.env.PUBLIC_URL}/favicon-32x32.png`,
  restore = true
) => {
  const prevFavicon = useRef(document.querySelector("link[rel*='icon']").href);

  useEffect(() => {
    const previous = prevFavicon.current;
    const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
    favicon.type = 'image/x-icon';
    favicon.rel = 'shortcut icon';
    favicon.href = faviconHref;
    document.getElementsByTagName('head')[0].appendChild(favicon);

    if (restore) {
      return () => {
        const favicon =
          document.querySelector("link[rel*='icon']") || document.createElement('link');
        favicon.type = 'image/x-icon';
        favicon.rel = 'shortcut icon';
        favicon.href = previous;
        document.getElementsByTagName('head')[0].appendChild(favicon);
      };
    }
    return;
  }, [faviconHref, prevFavicon, restore]);
};

export default useFavicon;
