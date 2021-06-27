export const scrollToIfNeeded = (parentEle, childEle) => {
  setTimeout(() => {
    const child = !childEle
      ? parentEle.querySelector('.selected')
      : typeof childEle === 'function'
      ? childEle()
      : childEle;
    const parentRect = parentEle?.getBoundingClientRect();
    const childRect = child?.getBoundingClientRect();
    const scrollValue = childRect?.bottom - (parentRect.bottom - childRect.height);

    if (scrollValue && Boolean(childRect?.bottom)) {
      parentEle.scrollBy({
        top: scrollValue,
        behavior: 'smooth',
      });
    } else if (child) {
      parentEle.scroll({
        bottom: child.height || 41,
        behavior: 'smooth',
      });
    }
  }, 1);
};

const handleArrowNavigation = (
  e,
  list,
  cursor,
  setCursor,
  setValue,
  ulListRef,
  selectedNewValue
) => {
  try {
    if (list?.length >= 1 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();

      const cursorPosition = Math.min(
        Math.max(cursor.position + (e.key === 'ArrowDown' ? +1 : -1), 0),
        list.length - 1
      );

      const newValueProperty =
        (selectedNewValue === 'title'
          ? list[cursorPosition]?.title || list[cursorPosition]?.snippet.title
          : list[cursorPosition]?.[selectedNewValue]) ||
        list[cursorPosition]?.user_name ||
        list[cursorPosition]?.name ||
        list[cursorPosition]?.id ||
        list[cursorPosition];

      setCursor(() => ({
        position: cursorPosition,
        used: true,
      }));

      setValue(newValueProperty);

      scrollToIfNeeded(ulListRef);
    }
  } catch (error) {
    console.log('handleArrowKey -> error', error);
  }
};
export default handleArrowNavigation;
