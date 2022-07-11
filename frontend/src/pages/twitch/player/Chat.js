import React, { useEffect, useRef, useState } from 'react';
import Schedule from '../schedule';
import {
  ChatWrapper,
  StyledChat,
  ChatHeader,
  ChatHeaderInner,
  ToggleSwitchChatSide,
} from './StyledComponents';
import styled from 'styled-components';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import { MdAccountBox } from 'react-icons/md';
import { FaWindowClose } from 'react-icons/fa';
import { GrPowerReset } from 'react-icons/gr';
import ShowNavigationButton from '../../navigation/ShowNavigationButton';
import ToolTip from '../../../components/tooltip/ToolTip';
import { Link } from 'react-router-dom';
import { TransparentButton } from '../../../components/styledComponents';

const Chat = ({ chatAsOverlay, channelName, streamInfo, chatState, updateChatState }) => {
  const [dragging, setDragging] = useState();
  const [overlayPosition, setOverlayPosition] = useState(
    { width: chatState?.chatwidth, ...(chatState?.overlayPosition || {}) } || {
      width: chatState?.chatwidth,
    }
  );
  // eslint-disable-next-line no-unused-vars
  const [rnd, setRnd] = useState();
  const overlayBackdropRef = useRef();
  const chatRef = useRef();
  const bottomRef = useRef();
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const keydown = (e) => e.key === 'Escape' && setDragging(false);
  useEventListenerMemo('keydown', keydown, window, chatAsOverlay);

  const onMouseOutsideWindow = async (e) => {
    if (
      (e.clientX < 0 ||
        e.clientY < 0 ||
        e.clientX > window.innerWidth ||
        e.clientY > window.innerHeight) &&
      dragging &&
      chatAsOverlay
    ) {
      await onDragMove(e);
      onDragStop();
    }
  };

  const onDragStop = (e) => {
    if (dragging && chatAsOverlay) {
      updateChatState((c) => ({
        ...c,
        overlayPosition,
        chatAsOverlay: true,
      }));
    }
    setDragging(false);
  };

  // const onResize = useMemo(
  //   () =>
  //     debounce(() => setRnd(Math.random()), 10, {
  //       leading: true,
  //       trailing: false,
  //     }),
  //   []
  // );
  const onResize = () => setRnd(Math.random());
  // trigger rerender to reposition chat when its outside window
  useEventListenerMemo('resize', onResize, window, chatAsOverlay);
  useEventListenerMemo('mouseleave', onMouseOutsideWindow, window, chatAsOverlay);

  const onDragInit = (e) => {
    if (e.button === 0) {
      setDragging(e.target);
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      console.log('mouseY:', mouseY);
      const chat = chatRef.current?.getBoundingClientRect();

      console.log('y: mouseY - chat.top:', mouseY - chat.top);
      console.log('dragging === bottomRef.current:', dragging === bottomRef.current);
      if (e.target === bottomRef.current) {
        setStartPos((c) => ({
          x: mouseX - chat.left,
          y: mouseY,
        }));
      } else {
        setStartPos((c) => ({
          x: mouseX - chat.left,
          y: mouseY - chat.top,
        }));
      }
    }
  };

  const onDragMove = async (e) => {
    console.log('e:', e);
    if (!chatAsOverlay) updateChatState((c) => ({ ...c, chatAsOverlay: true }), false);

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const chat = chatRef.current?.getBoundingClientRect();

    const x = mouseX - startPos.x;
    const y = mouseY - startPos.y;
    if (dragging === bottomRef.current) {
      setOverlayPosition((c) => ({
        ...c,
        x: Math.max(0, Math.min(x, window.innerWidth - chat.width)),
        y: Math.max(0, mouseY - chat.height),
      }));
    } else {
      setOverlayPosition((c) => ({
        ...c,
        x: Math.max(0, Math.min(x, window.innerWidth - chat.width)),
        y: Math.max(0, Math.min(y, window.innerHeight - chat.height)),
      }));
    }
  };

  useEffect(() => {
    setOverlayPosition((c) => ({
      height: window.innerHeight / 2,
      ...c,
      width: chatState?.chatwidth,
      ...(chatState?.overlayPosition || {}),
    }));
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
        data-chatasoverlay={chatAsOverlay}
      >
        <ChatHeader className='chatHeader'>
          <ChatHeaderBackdropEventDraggable
            onMouseDown={onDragInit}
            onMouseUp={onDragStop}
            onMouseMove={dragging ? onDragMove : () => {}}
          />
          <ChatHeaderInner>
            <ShowNavigationButton />
            <Link to='page'>
              <MdAccountBox size={24} />
            </Link>
            <Schedule
              user={streamInfo?.user_name || channelName}
              user_id={streamInfo?.user_id}
              absolute={false}
              style={{ padding: 0, marginRight: '5px' }}
            />

            {chatAsOverlay && (
              <ToolTip tooltip='Reset chat to sides'>
                <TransparentButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateChatState((c) => ({ ...c, chatAsOverlay: false }));
                  }}
                >
                  <GrPowerReset color='rgba(255, 255, 255, 0.75)' size={20} />
                </TransparentButton>
              </ToolTip>
            )}

            {!chatAsOverlay && (
              <ToolTip
                placement={'left'}
                width='max-content'
                delay={{ show: 500, hide: 0 }}
                tooltip='Switch chat side'
              >
                <ToggleSwitchChatSide
                  id='switchSides'
                  switched={String(chatState.switchChatSide)}
                  onClick={() => {
                    updateChatState((curr) => ({
                      ...curr,
                      switchChatSide: !chatState.switchChatSide,
                    }));
                  }}
                />
              </ToolTip>
            )}
          </ChatHeaderInner>
          <button
            className='chat__close-button'
            onClick={() => updateChatState((c) => ({ ...c, hideChat: true }))}
          >
            <FaWindowClose size={24} color='red' />
          </button>
        </ChatHeader>
        {chatAsOverlay && (
          <ResizerAllSides
            setOverlayPosition={setOverlayPosition}
            updateChatState={updateChatState}
            target={chatRef.current}
            overlayPosition={overlayPosition}
          />
        )}

        <InnerWrapper
          onMouseDown={onDragInit}
          onMouseUp={onDragStop}
          data-chatasoverlay={chatAsOverlay}
          onMouseMove={dragging ? onDragMove : () => {}}
        >
          {chatAsOverlay && dragging && <DragOverlay />}

          <StyledChat
            data-chatasoverlay={chatAsOverlay}
            frameborder='0'
            scrolling='yes'
            theme='dark'
            id={channelName + '-chat'}
            src={`https://www.twitch.tv/embed/${channelName}/chat?darkpopout&parent=aiofeed.com`}
          />
        </InnerWrapper>
        <BottomDiv
          ref={bottomRef}
          id='BottomDiv'
          onMouseDown={onDragInit}
          onMouseUp={onDragStop}
          onMouseMove={dragging ? onDragMove : () => {}}
          dragging={dragging}
        />
      </ChatWrapper>
    </>
  );
};
export default Chat;

const ChatHeaderBackdropEventDraggable = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  cursor: move;
`;

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
  cursor: move;
`;

const OverlayBackdrop = styled.div`
  position: fixed;
  cursor: ${({ cursor = 'move' }) => cursor};
  inset: 0;
  background: transparent;
  z-index: 99999;
`;

export const BottomDiv = styled.div`
  transition: height 250ms;
  height: ${({ dragging }) => (dragging ? '25px' : '2px')};
  width: 100%;
  background: var(--navigationbarBackground);
  cursor: move;
`;

const ResizerIcon = styled.div`
  position: absolute;
  z-index: 2;

  width: 20px;
  height: 20px;
  transition: border 250ms, opacity 250ms;
  border-color: #ffffff;
  opacity: 0.2;

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
    opacity: 1;
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

const ResizerAllSides = ({ setOverlayPosition, updateChatState, target, overlayPosition }) => {
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
    updateChatState((c) => ({ ...c, overlayPosition }));
  };

  const keydown = (e) => {
    if (e.key === 'Escape') setActive(false);
  };
  useEventListenerMemo('keydown', keydown, window, active);

  const onMouseMove = (e) => {
    const targetPos = target?.getBoundingClientRect();

    switch (active) {
      case 'topleft':
        setOverlayPosition((c) => {
          return {
            ...c,
            // y: c.y - (c.y - e.clientY),
            y: targetPos.top - (targetPos.top - e.clientY),
            height: targetPos.height + (targetPos.top - e.clientY),
            width: targetPos.width + (targetPos.left - e.clientX),
            x: e.clientX,
          };
        });
        break;
      case 'topright':
        setOverlayPosition((c) => {
          return {
            ...c,
            // // y: c.y - (c.y - e.clientY),
            y: targetPos.top - (targetPos.top - e.clientY),
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
