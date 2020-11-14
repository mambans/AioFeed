import React, { useRef } from 'react';
import { MdFormatListBulleted } from 'react-icons/md';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import useLockBodyScroll from '../hooks/useLockBodyScroll';

const SearchSubmitIcon = styled(FaSearch).attrs({ size: 16 })``;

const SearchSubmitA = styled.a`
  position: absolute;
  cursor: pointer;
  color: rgb(240, 240, 240);
  display: flex;
  margin-left: 0;
  padding-left: 5px;
  transform: translateY(-27px);
  z-index: 5;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'unset')};
  opacity: ${({ disabled }) => (disabled ? '0.3' : '1')};

  &:hover {
    color: rgb(255, 255, 255);
  }
`;

const SearchSubmitLink = styled(Link)`
  position: absolute;
  cursor: pointer;
  color: rgb(240, 240, 240);
  display: flex;
  margin-left: 0;
  padding-left: 5px;
  transform: translateY(-27px);
  z-index: 5;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'unset')};
  opacity: ${({ disabled }) => (disabled ? '0.3' : '1')};
  transition: opacity 500ms;

  &:hover {
    color: rgb(255, 255, 255);
  }
`;

export const SearchListForm = styled.form`
  background: var(--refreshButtonBackground);
  box-shadow: var(--refreshButtonShadow);
  border-radius: 5px;
  transition: width 250ms, min-width 250ms, margin-left 250ms, margin-right 250ms;
  width: ${({ open }) => (open ? '310px' : '125px')};
  min-width: ${({ open }) => (open ? '310px' : '125px')};
  margin-left: ${({ open, direction = 'left' }) =>
    direction === 'left' ? (open ? '0px' : '185px') : 0};
  margin-right: ${({ open, direction = 'left' }) =>
    direction === 'right' ? (open ? '0px' : '185px') : 0};
  z-index: 4;
  height: max-content;

  li {
    button.VodButton,
    svg.StreamFollowBtn,
    button.StreamUpdateNoitificationsButton {
      opacity: 1;
    }
  }

  &:after {
    content: '';
    width: ${({ open }) => (open ? '310px' : '0')};
    height: 1px;
    background: rgb(150, 150, 150);
    transition: width 500ms, height 500ms, transform 500ms;
    display: block;
    margin: auto;
    position: absolute;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(calc(125px / 2))')};
  }

  &:focus-within {
    width: 310px;
    min-width: 310px;
    margin-left: 0px;
  }

  input {
    padding: 0.5rem 0.5rem 0.5rem 27px;
    color: var(--refreshButtonColor);
    background: transparent;
    border: none;
    border-radius: 5px;
    text-overflow: ellipsis;
    width: ${({ showButton }) => (showButton ? 'calc(100% - (26px + 1.5rem))' : '100%')};
    position: relative;
    z-index: 5;
    font-size: ${({ inputFontSize }) => inputFontSize || 'inherit'};
    transition: color 250ms;
    outline: #0000 solid;

    &:hover {
      color: var(--textColor1Hover);
    }
  }

  svg#ToggleListBtn {
    padding: 7px;
    cursor: pointer;
    position: absolute;
    color: var(--refreshButtonColor);
    transition: color 250ms;
    z-index: 4;

    &:hover {
      color: #ffffff;
    }
  }

  &:hover {
    &:after {
      width: ${({ open }) => (open ? '310px' : '125px')};
      transform: translateX(0);
    }
  }
`;

export const SearchSubmitBtn = ({ href, to, disabled }) =>
  href ? (
    <SearchSubmitA href={href} disabled={disabled}>
      <SearchSubmitIcon />
    </SearchSubmitA>
  ) : (
    <SearchSubmitLink to={to} disabled={disabled}>
      <SearchSubmitIcon />
    </SearchSubmitLink>
  );

export default ({
  style = {},
  inputStyle = {},
  placeholder = 'Channel..',
  showButton = true,
  showDropdown = true,
  onExited = () => {},
  onSubmit,
  listIsOpen,
  onKeyDown,
  input,
  setListIsOpen,
  setCursor,
  children,
  resetInput,
  bindInput,
  inputFontSize,
  searchBtnPath,
}) => {
  const inputRef = useRef();

  useLockBodyScroll(listIsOpen);

  const submit = (evt) => {
    evt.preventDefault();
    onSubmit();
    inputRef.current.blur();
  };

  return (
    <SearchListForm
      style={{ ...style }}
      showButton={showButton}
      onSubmit={submit}
      open={listIsOpen}
      onKeyDown={onKeyDown}
      text={input}
      inputFontSize={inputFontSize}
    >
      <input
        ref={inputRef}
        style={{ ...inputStyle }}
        type='text'
        spellCheck='false'
        placeholder={placeholder}
        onFocus={() => setListIsOpen(true)}
        onBlur={() => setListIsOpen(false)}
        {...bindInput}
      />
      <SearchSubmitBtn
        disabled={!input}
        to={{
          pathname: searchBtnPath,
        }}
      />
      {showButton && (
        <MdFormatListBulleted
          id='ToggleListBtn'
          onClick={() => {
            inputRef.current.focus();
            resetInput();
          }}
          size={42}
        />
      )}
      <CSSTransition
        in={showDropdown && listIsOpen}
        timeout={250}
        classNames='fade-250ms'
        onExited={() => {
          setCursor({ position: 0 });
          resetInput();
          onExited();
        }}
        unmountOnExit
      >
        {children}
      </CSSTransition>
    </SearchListForm>
  );
};
