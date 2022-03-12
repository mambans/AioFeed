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
import { GrStackOverflow } from 'react-icons/gr';
import { MdAccountBox } from 'react-icons/md';
import { BiMove } from 'react-icons/bi';
import { FaWindowClose } from 'react-icons/fa';
import { TransparentButton } from '../../../components/styledComponents';
import ShowNavigationButton from '../../navigation/ShowNavigationButton';
import ToolTip from '../../../components/tooltip/ToolTip';
import { Link } from 'react-router-dom';

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
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const keydown = (e) => e.key === 'Escape' && setDragging(false);
  useEventListenerMemo('keydown', keydown, window, chatAsOverlay);

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

  const onDragInit = (e) => {
    if (e.button === 0) {
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
            <Link to='page'>
              <MdAccountBox size={24} />
            </Link>
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
                  return { ...c, chatAsOverlay: v };
                });
              }}
            >
              <GrStackOverflow size={20} />
            </TransparentButton>
            <TransparentButton
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDragInit(e);
              }}
              onMouseUp={onDragStop}
              onMouseMove={dragging ? onDragMove : () => {}}
              style={{ cursor: 'move' }}
            >
              <BiMove size={20} />
            </TransparentButton>

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
                    updateChatState((curr) => {
                      return {
                        ...curr,
                        switchChatSide: !chatState.switchChatSide,
                      };
                    });
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
          <ResizerAllSides setOverlayPosition={setOverlayPosition} target={chatRef.current} />
        )}

        <InnerWrapper
          onMouseDown={onDragInit}
          onMouseUp={onDragStop}
          data-chatAsOverlay={chatAsOverlay}
          onMouseMove={dragging ? onDragMove : () => {}}
        >
          {chatAsOverlay && dragging && <DragOverlay />}

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
  cursor: move;
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
