import React, { useState } from 'react';
import styled from 'styled-components';
import { MdHighQuality } from 'react-icons/md';
import { GrRefresh } from 'react-icons/gr';
import useEventListener from '../../../hooks/useEventListener';

const HEIGHT = 275;
const WIDTH = 250;

const Container = styled.div`
  position: absolute;
  width: ${WIDTH}px;
  min-height: ${HEIGHT}px;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 3px;
  left: ${({ left }) => left + 'px'};
  top: ${({ top }) => top + 'px'};
  padding: 0px 10px;
  font-weight: bold;
  color: rgb(225, 225, 225);

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      cursor: pointer;
      margin: 10px 0;
      transition: color 250ms;
      font-size: 1rem;

      svg {
        margin-right: 5px;
        color: inherit;
        stroke: rgb(225, 225, 225);

        path {
          stroke: rgb(225, 225, 225);
        }
      }

      &:hover,
      &:hover svg {
        color: #ffffff;
        opacity: 1;
      }
    }
  }
`;

const BackDrop = styled.div`
  background: rgba(0, 0, 0, 0);
  width: ${({ type, hidechat }) =>
    hidechat === 'true' ? '99vw' : type === 'live' ? '90vw' : '100vw'};
  height: 100%;
  bottom: 0px;
  position: absolute;
`;

export default ({
  PlayerUIControlls,
  type,
  hidechat,
  TwitchPlayer,
  showAndResetTimer,
  setChatState,
  children,
  DEFAULT_CHAT_WIDTH,
}) => {
  const [show, setShow] = useState();
  useEventListener('contextmenu', toggleShowHide, PlayerUIControlls);

  function toggleShowHide(e) {
    e.preventDefault();
    showAndResetTimer();
    const boundary = PlayerUIControlls.getBoundingClientRect();
    const mouseX = e.clientX - boundary.left;
    const mouseY = e.clientY;

    setShow({
      show: true,
      x: mouseX + WIDTH > boundary.width ? mouseX - (mouseX + WIDTH - boundary.width) : mouseX,
      y: mouseY + HEIGHT > boundary.bottom ? mouseY - (mouseY + HEIGHT - boundary.bottom) : mouseY,
    });
    return false;
  }

  if (show && show.show) {
    return (
      <>
        <BackDrop
          onClick={() => {
            setShow(false);
          }}
          type={type}
          hidechat={hidechat}
        />
        <Container left={show.x} top={show.y}>
          <ul
            onClick={() => {
              setShow(false);
            }}
          >
            <li
              onClick={() => {
                TwitchPlayer.setQuality('chunked');
              }}
            >
              <MdHighQuality size={24} />
              {'Max quality (Source)'}
            </li>
            {children}
            <li
              onClick={() => {
                setChatState({
                  chatWidth: DEFAULT_CHAT_WIDTH,
                  switchChatSide: false,
                  hideChat: false,
                });
                localStorage.setItem(
                  'TwitchChatState',
                  JSON.stringify({
                    chatWidth: DEFAULT_CHAT_WIDTH,
                    switchChatSide: false,
                    hideChat: false,
                  })
                );
              }}
            >
              <GrRefresh size={24} />
              {'Reset video/chat positions'}
            </li>
          </ul>
        </Container>
      </>
    );
  }
  return null;
};
