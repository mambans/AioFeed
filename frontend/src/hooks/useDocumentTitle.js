import { useEffect, useRef } from 'react';

const useDocumentTitle = (title, restore = true) => {
  const prevTitleRef = useRef(document.title);
  const append = `${title ? ' | ' : ''}AioFeed`;

  const setDocumentTitle = (title) => {
    if (document.title !== title) document.title = (title || '') + append;
  };

  setDocumentTitle(title);

  useEffect(() => {
    const previous = prevTitleRef.current;
    if (restore) {
      return () => (document.title = previous);
    }
    return;
  }, [restore]);

  return [document.title, setDocumentTitle];
};

export default useDocumentTitle;
