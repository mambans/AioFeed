import React, { useRef } from 'react';
import { MdFormatListBulleted } from 'react-icons/md';
import { CSSTransition } from 'react-transition-group';
import styled, { css } from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import useLockBodyScroll from '../../hooks/useLockBodyScroll';
import useClicksOutside from '../../hooks/useClicksOutside';
import { ButtonLookalikeStyle } from './sharedStyledComponents';

const SearchSubmitIcon = styled(FaSearch).attrs({ size: 16 })``;

export const submiteButtonStyle = ({ btnDisabled }) => css`
  position: absolute;
  cursor: pointer;
  color: rgb(175, 175, 175);
  display: flex;
  margin-left: 5px;
  /* padding-left: 5px; */
  transform: translateY(-27px);
  z-index: 5;
  pointer-events: ${btnDisabled ? 'none' : 'unset'};
  opacity: ${btnDisabled ? '0.3' : '1'};
  transition: opacity 500ms;

  &:hover {
    color: rgb(255, 255, 255);
  }
`;

export const SearchListForm = styled.form`
  ${ButtonLookalikeStyle}
  transition: width 250ms, min-width 250ms, margin-left 250ms, margin-right 250ms, color 250ms, background-color 250ms, border-color 250ms, box-shadow 250ms,
    opacity 250ms;
  background: ${({ open }) =>
    open ? 'var(--refreshButtonHoverBackground)' : 'var(--refreshButtonBackground);'};
  width: ${({ open }) => (open ? '310px' : '125px')};
  min-width: ${({ open }) => (open ? '310px' : '125px')};
  /* margin-left: ${({ open, direction = 'left' }) =>
    direction === 'left' ? (open ? '0px' : '185px') : 0};
  margin-right: ${({ open, direction = 'left' }) =>
    direction === 'right' ? (open ? '0px' : '185px') : 0}; */
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

    &:hover,
    &:active,
    &:focus {
      border: none;
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

  *[type='submitBtn'] {
    ${submiteButtonStyle}
  }
`;

export const SearchSubmitBtn = ({ href, to }) =>
  href ? (
    <a href={href} type='submitBtn'>
      <SearchSubmitIcon />
    </a>
  ) : (
    <Link to={to} type='submitBtn'>
      <SearchSubmitIcon />
    </Link>
  );

const SearchList = ({
  style = {},
  inputStyle = {},
  placeholder = 'Channel..',
  showButton = true,
  showDropdown = true,
  onExited = () => {},
  onSubmit = () => {},
  listIsOpen,
  onKeyDown = () => {},
  input,
  setListIsOpen,
  setCursor = () => {},
  children,
  resetInput = () => {},
  bindInput,
  inputFontSize,
  searchBtnPath,
  leftIcon,
}) => {
  const inputRef = useRef();
  const listRef = useRef();

  useLockBodyScroll(listIsOpen);
  useClicksOutside(listRef, () => setListIsOpen(false), Boolean(listIsOpen));

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
      ref={listRef}
      btnDisabled={!input}
    >
      <input
        ref={inputRef}
        style={{ ...inputStyle }}
        type='text'
        spellCheck='false'
        placeholder={placeholder}
        onFocus={() => setListIsOpen(true)}
        // onBlur={() => setListIsOpen(false)}
        {...bindInput}
      />
      {leftIcon || (
        <SearchSubmitBtn
          type='submitBtn'
          to={{
            pathname: searchBtnPath,
          }}
        />
      )}
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
      {children && (
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
      )}
    </SearchListForm>
  );
};

export default SearchList;
