import { useEffect, useMemo } from 'react';

export default (eventName, handler, element = window, secondArgument = true, options = {}) => {
  const savedHandler = useMemo(() => handler, [handler]);
  const savedEventName = useMemo(() => eventName, [eventName]);
  const savedElement = useMemo(() => element, [element]);
  const savedSecondArgument = useMemo(() => secondArgument, [secondArgument]);
  const savedOptions = useMemo(() => options, [options]);

  useEffect(() => {
    const isSupported = savedElement?.addEventListener;

    if (!isSupported) return;

    const eventListener = (event) => savedHandler(event);
    if (Array.isArray(savedEventName) && savedEventName[0]) {
      Boolean(savedSecondArgument) &&
        savedEventName.map((event) =>
          savedElement.addEventListener(event, eventListener, savedOptions)
        );

      return () => {
        savedEventName.map((event) => savedElement.removeEventListener(event, eventListener));
      };
    } else {
      Boolean(savedSecondArgument) &&
        savedElement.addEventListener(savedEventName, eventListener, savedOptions);

      return () => {
        savedElement.removeEventListener(savedEventName, eventListener);
      };
    }
  }, [savedEventName, savedElement, savedSecondArgument, savedHandler, savedOptions]);
};
