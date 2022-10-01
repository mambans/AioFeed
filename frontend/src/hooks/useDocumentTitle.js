import { useCallback, useEffect, useRef } from 'react';

const useDocumentTitle = (title, restore = true) => {
  const prevTitleRef = useRef(document.title);
  const append = `${title ? ' | ' : ''}AioFeed`;

  const setDocumentTitle = useCallback(
    (newValue) => {
      const title = typeof newValue === 'function' ? newValue(prevTitleRef.current) : newValue;

      if (document.title !== title) document.title = (title || '') + append;
    },
    [append]
  );

  useEffect(() => {
    if (title !== false) setDocumentTitle(title);
  }, [title, setDocumentTitle]);

  useEffect(() => {
    const previous = prevTitleRef.current;
    if (restore) {
      return () => (document.title = previous);
    }
    return () => {};
  }, [restore]);

  return [document.title, setDocumentTitle];
};

export default useDocumentTitle;
