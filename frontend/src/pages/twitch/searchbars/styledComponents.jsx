import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

export const DropDownWrapper = styled.div`
  height: 500px;
  overflow: scroll;
  /* display: flex;
  flex-direction: column;
  gap: 0.5rem; */
  padding: 1rem 0.5rem;
  position: ${({ position }) => position || 'absolute'};
  /* background: var(--refreshButtonHoverBackground); */
  background: var(--popupListsBackground);
  /* width: 100%; */
  width: ${({ width, wrap }) =>
    width !== 'false' ? width + 'px' : wrap === 'true' ? '100%' : 'max-content'};
  /* min-width: ${({ width }) => (width !== 'false' ? width + 'px' : 'max-content')}; */
  visibility: hidden;
  transition: visibility 0s ease 250ms, min-width 250ms;
`;

export const Item = styled(Link).attrs({ className: 'item' })`
  display: none; //flex
  gap: 0.5rem;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: color 250ms, background 250ms;
  padding: 0.35rem;
  min-height: 46px;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  justify-content: space-between;

  &.selected {
    font-weight: bold;
  }

  &:hover: {
    background-color: rgba(51, 51, 61, 0.5);
  }
`;

export const Wrapper = styled.div.attrs({ className: 'searchbar' })`
  position: relative;
  /* background: var(--navigationbarBackground); */
  width: ${({ open }) => (open ? '310px' : '125px')};
  outline: none;
  transition: width 250ms;
  z-index: 2;
  border-radius: 5px 5px 0 0;

  &:focus,
  &:focus-within {
    width: 310px;
    ${DropDownWrapper} {
      visibility: visible;
      min-width: ${({ wrap }) => (wrap ? 'unset' : 'max-content')};
      transition: visibility 0s ease 0ms;

      ${Item} {
        display: flex;
      }
    }
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  color: var(--refreshButtonColor);
  background: transparent;
  border: none;

  text-overflow: ellipsis;
  /* width: ${({ showButton }) => (showButton ? 'calc(100% - (26px + 1.5rem))' : '100%')}; */
  position: relative;
  z-index: 5;
  font-size: ${({ inputFontSize }) => inputFontSize || 'inherit'};
  transition: color 250ms, border 250ms;
  outline: #0000 solid;

  &::placeholder {
    color: #373d44;
  }
`;

export const pulseLight = keyframes`
  0% {background: #36393fd1;}
  40% {background: #464d54;}
  100% {background: #36393fd1;}
`;

export const Title = styled.p.attrs({ className: 'title' })`
  margin: 0;
  color: #ffffff;
  text-overflow: ellipsis;
  overflow: hidden;

  &:empty {
    height: 25px;
    width: 100%;
    border-radius: 5px;
    animation: ${pulseLight} 2s linear infinite;
  }
`;
export const ProfileWrapper = styled.div`
  position: relative;
  height: 35px;
  min-height: 35px;
  width: 35px;
  min-width: 35px;
  border-radius: 5px;

  &:empty {
    animation: ${pulseLight} 2s linear infinite;
  }
`;

export const LeftWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  white-space: nowrap;
  overflow: ${({ wrap }) => (wrap === 'true' ? 'hidden' : 'unset')};
`;
export const Profile = styled.img`
  border-radius: 5px;
  height: 100%;
  width: 100%;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(200, 200, 200, 0.2);

  &:focus {
    border-bottom: 1px solid rgb(200, 200, 200);
  }
`;

export const SearchBarSuffixButton = styled.div`
  cursor: pointer;
  /* position: absolute; */
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 5;
  transition: opacity 250ms;
  opacity: ${({ disabled }) => (disabled ? '0.2' : '1')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  padding: 0.5rem;
`;
