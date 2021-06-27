import { useRef, useEffect } from 'react';

const useEventListener = (
  eventName,
  handler,
  element = window,
  secondArgument = true,
  options = {}
) => {
  const savedHandler = useRef(handler);
  const savedEventName = useRef(eventName);

  useEffect(() => {
    savedHandler.current = handler;
    savedEventName.current = eventName;
  }, [handler, eventName]);

  useEffect(() => {
    const isSupported = element?.addEventListener;
    const savedEventNameRef = savedEventName.current;

    if (!isSupported) return;

    const eventListener = (event) => savedHandler.current(event);
    if (Array.isArray(savedEventNameRef) && savedEventNameRef[0]) {
      Boolean(secondArgument) &&
        savedEventNameRef.map((event) => element.addEventListener(event, eventListener, options));

      return () =>
        savedEventNameRef.map((event) => element.removeEventListener(event, eventListener));
    } else {
      Boolean(secondArgument) &&
        element.addEventListener(savedEventNameRef, eventListener, options);

      return () => element.removeEventListener(savedEventNameRef, eventListener);
    }
  }, [savedEventName, element, secondArgument, options]);
};
export default useEventListener;
