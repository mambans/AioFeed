import { useEffect, useMemo } from 'react';

/**
 * Hook for adding/removing event listeners
 * @param {String} eventName - the event listener name
 * @param {Function} handler - the event listener function
 * @param {Element} [element=window] - the element to add the event to
 * @param {any} [secondArgument=true] - A second argument (converted to a boolean) if event should be added
 * @param {Object} [options={}] - the event listener options
 */
const useEventListenerMemoArray = (
  eventName,
  handler,
  element = window,
  secondArgument = true,
  options = {}
) => {
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
      if (Array.isArray(savedElement) && Boolean(savedElement.length)) {
        Boolean(savedSecondArgument) &&
          savedElement.map((ele) =>
            savedEventName.map((event) => ele.addEventListener(event, eventListener, savedOptions))
          );

        return () =>
          savedElement.map((ele) =>
            savedEventName.map((event) =>
              ele.removeEventListener(event, eventListener, savedOptions)
            )
          );
      } else {
        Boolean(savedSecondArgument) &&
          savedEventName.map((event) =>
            savedElement.addEventListener(event, eventListener, savedOptions)
          );

        return () =>
          savedEventName.map((event) => savedElement.removeEventListener(event, eventListener));
      }
    } else {
      if (Array.isArray(savedElement) && Boolean(savedElement.length)) {
        Boolean(savedSecondArgument) &&
          savedElement.map((ele) =>
            ele.addEventListener(savedEventName, eventListener, savedOptions)
          );

        return () =>
          savedElement.map((ele) =>
            ele.removeEventListener(savedEventName, eventListener, savedOptions)
          );
      } else {
        Boolean(savedSecondArgument) &&
          savedElement.addEventListener(savedEventName, eventListener, savedOptions);

        return () => savedElement.removeEventListener(savedEventName, eventListener);
      }
    }
  }, [savedEventName, savedElement, savedSecondArgument, savedHandler, savedOptions]);
};
export default useEventListenerMemoArray;
