export const scrollToIfNeeded = (parentDiv, childDiv, direction) => {
  const parentRect = parentDiv?.getBoundingClientRect();
  const childRect = childDiv?.getBoundingClientRect();

  const scrollDown =
    childRect?.bottom + 20.5 >= parentRect?.bottom || childRect?.top + 20.5 >= parentRect?.bottom;
  const scrollUp =
    childRect?.top - 20.5 <= parentRect?.top || childRect?.bottom - 20.5 <= parentRect?.top;

  if (scrollDown || scrollUp) {
    childDiv.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    parentDiv.scrollBy({
      top: direction === 'Down' && scrollDown ? +41 : direction === 'Up' && scrollUp ? -41 : 0,
      behavior: 'smooth',
    });
  }
};

export default (e, list, cursor, setCursor, setValue, ulListRef, selectedNewValue) => {
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
      scrollToIfNeeded(
        ulListRef,
        document.querySelector('.selected'),
        e.key === 'ArrowDown' ? 'Down' : 'Up'
      );
    }
  } catch (error) {
    console.log('handleArrowKey -> error', error);
  }
};
