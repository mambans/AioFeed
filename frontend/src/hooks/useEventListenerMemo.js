import { useEffect, useMemo } from 'react';

/**
 * Hook for adding/removing event listeners
 * @param {String} eventName - the event listener name
 * @param {Function} handler - the event listener function
 * @param {Element} [element=window] - the element to add the event to
 * @param {any} [secondArgument=true] - A second argument (converted to a boolean) if event should be added
 * @param {Object} [options={}] - the event listener options
 */
const useEventListenerMemo = (
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

    if (Boolean(savedSecondArgument)) {
      savedElement.addEventListener(savedEventName, savedHandler, savedOptions);
    }

    return () => savedElement.removeEventListener(savedEventName, savedHandler);
  }, [savedEventName, savedElement, savedSecondArgument, savedHandler, savedOptions]);
};
export default useEventListenerMemo;
