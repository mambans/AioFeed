import React, { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { parseNumberAndString } from './dragDropUtils';
import MyListsContext from './MyListsContext';
import styled, { keyframes } from 'styled-components';

import { addFavoriteVideo, removeFavoriteVideo } from './addToListModal/AddToListModal';
import { RemoveItemBtn, AddedItemBtn, AddItemBtn } from './StyledComponents';
import Colors from '../../components/themes/Colors';

const buttonBubbleAnimation = keyframes`
  0% {
    transform: scale(1);
    filter: brightness(1) saturate(1);

  }
  50% {
      transform: scale(1.2);
      filter: brightness(1.2) saturate(1.2);
    }
  70% {
    transform: scale(1.1);
    filter: brightness(1.1) saturate(1.1);
  }
  80% {
    transform: scale(1.35);
    filter: brightness(1.35) saturate(1.35);
  }
  100% {
    transform: scale(1);
    filter: brightness(1) saturate(1);
  }
`;

const Title = styled.span`
  margin-left: 25px;
`;

const Button = styled.button`
  height: 35px;
  position: relative;
  padding: 0.15em 0.35em;
  margin-left: 0.5em;
  border: none;
  border-radius: 0.2rem;
  background-color: transparent;
  color: #ffffff;
  display: flex;
  align-items: center;
  width: 100%;

  ${RemoveItemBtn} {
    opacity: 0;
  }
  ${AddedItemBtn} {
    opacity: ${({ added }) => (added === 'true' ? 1 : 0)};
  }
  ${AddItemBtn} {
    opacity: ${({ added }) => (added === 'true' ? 0 : 1)};
  }

  &:hover {
    ${RemoveItemBtn} {
      opacity: ${({ added }) => (added === 'true' ? 1 : 0)};
    }
    ${AddedItemBtn} {
      opacity: 0;
      color: #ffffff;
    }
    ${AddItemBtn} {
      opacity: ${({ added }) => (added === 'true' ? 0 : 1)};
      color: ${Colors.green};
    }
  }

  svg {
    animation-name: ${({ active }) => active && buttonBubbleAnimation};
    animation-duration: 1000ms;
    position: absolute;
    padding-top: 2px;
  }
`;

const AddVideoButton = ({ video_id, list, redirect }) => {
  const { setLists } = useContext(MyListsContext) || {};

  const [active, setActive] = useState();
  const [added, setAdded] = useState(list?.videos?.includes?.(parseNumberAndString(video_id)));
  const resetTimer = useRef();
  const ref = useRef();

  const handleOnClick = (e) => {
    clearTimeout(resetTimer.current);
    setActive(true);
    resetTimer.current = setTimeout(() => setActive(false), 1000);

    if (added) {
      removeFavoriteVideo({ setLists, id: list?.id, videoId: video_id });
      window.history.pushState(
        {},
        document.title,
        `${window.location.origin + window.location.pathname}`
      );
      return;
    }

    addFavoriteVideo({ setLists, id: list?.id, videoId: video_id });
    if (redirect && list?.title) {
      window.history.pushState(
        {},
        document.title,
        `${window.location.origin + window.location.pathname}?list=${list?.title}`
      );
    }
  };

  useEffect(() => {
    const videoAdded = list?.videos?.includes?.(parseNumberAndString(video_id));

    if (!active) {
      setAdded(videoAdded);
      return;
    }
  }, [list?.videos, video_id, active]);

  useEffect(() => {
    return () => {
      clearTimeout(resetTimer.current);
    };
  }, []);

  return (
    <Button
      ref={ref}
      onClick={handleOnClick}
      active={active}
      added={String(added)}
      disabled={active}
    >
      {added ? (
        <>
          <RemoveItemBtn size={18} color={Colors.red} />
          <AddedItemBtn size={18} />
        </>
      ) : (
        <AddItemBtn size={18} />
      )}
      <Title>{list.title}</Title>
    </Button>
  );
};
export default AddVideoButton;
