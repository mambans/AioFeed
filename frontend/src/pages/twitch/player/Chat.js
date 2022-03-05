import React, { useEffect, useRef, useState } from 'react';
import Schedule from '../schedule';
import { ChatWrapper, StyledChat, ChatHeader, ChatHeaderInner } from './StyledComponents';
import styled from 'styled-components';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import { GrStackOverflow } from 'react-icons/gr';
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';
import { FaWindowClose } from 'react-icons/fa';
import { TransparentButton } from '../../../components/styledComponents';
import ShowNavigationButton from '../../navigation/ShowNavigationButton';

const Chat = ({ chatAsOverlay, channelName, streamInfo, chatState, updateChatState }) => {
  const [dragging, setDragging] = useState();
  const [overlayPosition, setOverlayPosition] = useState(
    { width: chatState?.chatwidth, ...(chatState?.overlayPosition || {}) } || {
      width: chatState?.chatwidth,
    }
  );
  const [locked, setLocked] = useState(true);
  const overlayBackdropRef = useRef();
  const chatRef = useRef();
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const keydown = (e) => e.key === 'Escape' && setDragging(false);
  useEventListenerMemo('keydown', keydown, window, chatAsOverlay);

  const onDragInit = (e) => {
    if (e.button === 0 && !locked) {
      setDragging(true);
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const chat = chatRef.current?.getBoundingClientRect();

      setStartPos({ x: mouseX - chat.left, y: mouseY - chat.top });
    }
  };

  const onDragMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const chat = chatRef.current?.getBoundingClientRect();

    const x = mouseX - startPos.x;
    const y = mouseY - startPos.y;
    setOverlayPosition((c) => ({
      ...c,
      x: Math.max(0, Math.min(x, window.innerWidth - chat.width)),
      y: Math.max(0, Math.min(y, window.innerHeight - chat.height)),
    }));
  };

  const onDragStop = (e) => {
    if (dragging) {
      updateChatState((c) => ({ ...c, overlayPosition: overlayPosition }));
    }
    setDragging(false);
  };

  useEffect(() => {
    setOverlayPosition({ width: chatState?.chatwidth, ...(chatState?.overlayPosition || {}) });
  }, [chatState?.overlayPosition, chatState?.chatwidth]);

  return (
    <>
      {chatAsOverlay && dragging && (
        <OverlayBackdrop ref={overlayBackdropRef} onMouseUp={onDragStop} onMouseMove={onDragMove} />
      )}
      <ChatWrapper
        ref={chatRef}
        overlayPosition={overlayPosition}
        dragging={dragging}
        id='chat'
        chatAsOverlay={chatAsOverlay}
        data-chatAsOverlay={chatAsOverlay}
      >
        <ChatHeader>
          <ChatHeaderInner>
            <ShowNavigationButton />
            <Schedule
              user={streamInfo?.user_name || channelName}
              user_id={streamInfo?.user_id}
              absolute={false}
              style={{ padding: 0, marginRight: '5px' }}
            />

            <TransparentButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateChatState((c) => {
                  const v = !c.chatAsOverlay;
                  if (v) setLocked(false);
                  return { ...c, chatAsOverlay: v };
                });
              }}
            >
              <GrStackOverflow size={20} />
            </TransparentButton>

            {chatAsOverlay && (
              <TransparentButton
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLocked((c) => !c);
                }}
              >
                {locked ? (
                  <AiFillLock size={20} fill='green' />
                ) : (
                  <AiFillUnlock size={20} fill='red' />
                )}
              </TransparentButton>
            )}
          </ChatHeaderInner>
          <button onClick={() => updateChatState((c) => ({ ...c, hideChat: true }))}>
            <FaWindowClose size={24} color='red' />
          </button>
        </ChatHeader>
        {!locked && chatAsOverlay && (
          <ResizerAllSides setOverlayPosition={setOverlayPosition} target={chatRef.current} />
        )}

        <InnerWrapper
          onMouseDown={onDragInit}
          onMouseUp={onDragStop}
          locked={locked}
          data-chatAsOverlay={chatAsOverlay}
          onMouseMove={dragging ? onDragMove : () => {}}
        >
          {chatAsOverlay && !locked && <DragOverlay />}

          <StyledChat
            data-chatAsOverlay={chatAsOverlay}
            frameborder='0'
            scrolling='yes'
            theme='dark'
            id={channelName + '-chat'}
            src={`https://www.twitch.tv/embed/${channelName}/chat?darkpopout&parent=aiofeed.com`}
          />
        </InnerWrapper>
      </ChatWrapper>
    </>
  );
};
export default Chat;

const DragOverlay = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background: transparent;
`;
const InnerWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  cursor: ${({ locked }) => (locked ? 'initial' : 'move')};
`;

const OverlayBackdrop = styled.div`
  position: fixed;
  cursor: ${({ cursor = 'move' }) => cursor};
  inset: 0;
  background: transparent;
  z-index: 99999;
`;

const ResizerIcon = styled.div`
  position: absolute;
  z-index: 2;

  width: 20px;
  height: 20px;
  transition: border 250ms;
  border-color: rgb(150, 150, 150);

  &.topleft {
    top: 0;
    left: 0;
    cursor: nw-resize;
    border-style: solid none none solid;
  }
  &.topright {
    top: 0;
    right: 0;
    cursor: ne-resize;
    border-style: solid solid none none;
  }
  &.bottomright {
    bottom: 0;
    right: 0;
    cursor: nw-resize;
    border-style: none solid solid none;
  }

  &.bottomleft {
    bottom: 0;
    left: 0;
    cursor: ne-resize;
    border-style: none none solid solid;
  }

  &:hover {
    border-color: #ffffff;
  }

  svg {
    transition: fill 250ms;
    transform: rotate(90deg);
    fill: ${({ active }) => (active ? 'rgb(255,255,255)' : 'rgba(255,255,255,0.3)')};

    &:hover {
      fill: ${({ active }) => (active ? 'rgb(255,255,255)' : 'rgba(255,255,255,0.5)')};
    }
  }
`;

const ResizerAllSides = ({ setOverlayPosition, target }) => {
  const [active, setActive] = useState();

  const onMouseDown = (e, dir) => {
    if (e.button === 0) {
      e.preventDefault();
      e.stopPropagation();
      setActive(dir);
    }
  };
  const onMouseUp = () => {
    setActive(false);
  };

  const keydown = (e) => {
    if (e.key === 'Escape') setActive(false);
  };
  useEventListenerMemo('keydown', keydown, window, active);

  const onMouseMove = (e) => {
    const targetPos = target?.getBoundingClientRect();

    switch (active) {
      case 'topleft':
        setOverlayPosition((c) => ({
          ...c,
          y: c.y - (targetPos.top - e.clientY),
          height: targetPos.height + (targetPos.top - e.clientY),
          width: targetPos.width + (targetPos.left - e.clientX),
          x: e.clientX,
        }));
        break;
      case 'topright':
        setOverlayPosition((c) => {
          return {
            ...c,
            y: c.y - (targetPos.top - e.clientY),
            height: targetPos.height + (targetPos.top - e.clientY),
            width: targetPos.width + (e.clientX - targetPos.right),
          };
        });
        break;
      case 'bottomright':
        setOverlayPosition((c) => ({
          ...c,
          height: targetPos.height + (e.clientY - targetPos.bottom),
          width: targetPos.width + (e.clientX - targetPos.right),
        }));
        break;
      case 'bottomleft':
        setOverlayPosition((c) => ({
          ...c,
          height: targetPos.height + (e.clientY - targetPos.bottom),
          width: targetPos.width + (targetPos.left - e.clientX),
          x: e.clientX,
        }));
        break;
      default:
        break;
    }
  };

  const cursor = (() => {
    if (['topleft', 'bottomright'].includes(active)) return 'nw';
    if (['topright', 'bottomleft'].includes(active)) return 'ne';
  })();

  return (
    <>
      <Resizer
        onMouseDown={(e) => onMouseDown(e, 'topleft')}
        onMouseUp={onMouseUp}
        active={!!active}
        className={'topleft'}
      />
      <Resizer
        onMouseDown={(e) => onMouseDown(e, 'topright')}
        onMouseUp={onMouseUp}
        active={!!active}
        className={'topright'}
      />
      <Resizer
        onMouseDown={(e) => onMouseDown(e, 'bottomright')}
        onMouseUp={onMouseUp}
        active={!!active}
        className={'bottomright'}
      />
      <Resizer
        onMouseDown={(e) => onMouseDown(e, 'bottomleft')}
        onMouseUp={onMouseUp}
        active={!!active}
        className={'bottomleft'}
      />

      {!!active && (
        <OverlayBackdrop
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          cursor={`${cursor}-resize`}
        />
      )}
    </>
  );
};

const Resizer = ({ className, onMouseDown, active }) => {
  return (
    <>
      <ResizerIcon onMouseDown={onMouseDown} active={active} className={className} />
    </>
  );
};
