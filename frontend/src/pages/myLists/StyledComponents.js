import styled, { css } from 'styled-components';
import { Button, Form } from 'react-bootstrap';
import { MdPlaylistAdd, MdPlaylistAddCheck, MdAdd } from 'react-icons/md';
import { IoIosCloseCircleOutline, IoMdCloseCircle } from 'react-icons/io';
import { CgPlayListRemove } from 'react-icons/cg';
import Colors from '../../components/themes/Colors';

// export const Open = styled(MdStar)`
//   position: absolute;
//   right: 5px;
//   top: 5px;
//   /* color: ${({ open }) => (open ? 'rgb(255,255,0)' : 'rgb(200,200,200)')}; */
//   color: rgb(200, 200, 200);
//   transform: ${({ open }) => (open ? 'scale(1.2)' : 'unset')};
//   z-index: 4;
//   cursor: pointer;
//   transition: color 250ms, transform 250ms;

//   &:hover {
//     color: ${({ open }) => (open ? 'rgb(200,200,200)' : 'rgb(255,255,0)')};
//     transform: scale(1.2);
//   }
// `;

export const Close = styled(IoIosCloseCircleOutline)`
  position: absolute;
  right: 6px;
  top: 6px;
  color: ${({ open }) => (open ? '#ffffff' : 'rgb(200,200,200)')};
  transform: ${({ open }) => (open ? 'scale(1.2)' : 'unset')};
  z-index: 4;
  cursor: pointer;
  transition: color 250ms, transform 250ms;

  &:hover {
    /* color: red; */
    color: #ffffff;
    transform: scale(1.2);
  }
`;

export const Lists = styled.div`
  /* background: var(--navigationbarBackground); */
  background: rgba(20, 20, 20, 0.92);
  /* padding: 7px; */
  border-radius: 5px;
  box-shadow: -3px 3px 5px black;

  &.fade-appear {
    opacity: 0;
    transition: opacity 250ms;
  }
  &.fade-appear-active {
    opacity: 1;
    transition: opacity 250ms;
  }

  &.fade-enter {
    opacity: 0;
    transition: opacity 250ms;
  }

  &.fade-enter-active {
    opacity: 1;
    transition: opacity 250ms;
  }

  &.fade-exit {
    opacity: 1;
    transition: opacity 250ms;
  }

  &.fade-exit-active {
    opacity: 0;
    transition: opacity 250ms;
  }

  &.fade-exit-done {
    opacity: 0;
    transition: opacity 250ms;
  }
`;

export const IconContainer = styled.div`
  position: relative;
  cursor: pointer;
  z-index: 1;
  margin-left: 7px;
  transition: color 250ms, opacity 250ms;

  .actionIcon {
    position: absolute;
    bottom: 0;
    opacity: 0;
    transition: opacity 250ms;
  }

  &:hover {
    .actionIcon {
      opacity: 1;
    }

    .add {
      color: ${Colors.green};
    }

    .remove {
      color: rgb(100, 100, 100);
    }
  }
`;

export const AddedItemBtn = styled(MdPlaylistAddCheck)`
  transition: color 250ms, opacity 250ms;
  color: ${Colors.green};

  &:hover {
    color: rgb(100, 100, 100);
  }
`;

export const RemoveItemBtn = styled(CgPlayListRemove)`
  transition: color 250ms, opacity 250ms;
  color: rgb(100, 100, 100);

  &:hover {
    color: ${Colors.red};
  }
`;
export const RemoveItemFromCurrentListIcon = styled(IoMdCloseCircle)`
  transition: color 250ms, opacity 250ms;
  color: ${Colors.red};

  &:hover {
    color: ${Colors.red};
  }
`;

export const AddItemBtn = styled(MdPlaylistAdd)`
  transition: color 250ms, opacity 250ms;

  &:hover {
    color: ${({ disablehovereffect }) =>
      disablehovereffect === 'true' ? '#ffffff' : Colors.green};
  }
`;

const listCss = css`
  transition: color 250ms, opacity 250ms;
  position: absolute;
  left: 5px;
`;

export const ListItem = styled.div`
  height: 30px;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  /* box-shadow: 0px 1px 2px #2f2c37; */
  display: flex;
  align-items: center;
  transition: color 250ms;
  color: rgb(200, 200, 200);
  cursor: ${({ cursor }) => cursor || 'unset'};
  position: relative;

  /* button {
    background: none;
    border: none;
    box-shadow: none;
    font-weight: inherit;
    transition: inherit;
    color: ${({ added }) => (added ? '#ffffff' : 'rgb(200,200,200)')};

    &:hover {
      color: #ffffff;
    }
  } */

  &:last-child {
    box-shadow: none;
  }

  &:hover:not(${IconContainer}) {
    color: #ffffff;
  }

  svg {
    cursor: pointer;
  }
`;

export const IconContainerListItem = styled.div`
  display: flex;

  ${RemoveItemBtn} {
    ${listCss};
    opacity: 0;
  }
  ${AddedItemBtn} {
    ${listCss};
    opacity: ${({ added }) => (added === 'true' ? 1 : 0)};
  }
  ${AddItemBtn} {
    ${listCss};
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
`;

export const ListsLink = styled.div`
  display: flex;
  justify-content: center;
  height: 23px;
  padding-top: 5px;
  margin-bottom: 5px;

  a {
    color: rgb(200, 200, 200);
    font-weight: 600;
    font-size: 14px;
    align-items: center;
    width: max-content;

    &:hover {
      color: #ffffff;
    }
  }
`;

export const FormButton = styled(Button)`
  padding: 2px;
  display: flex;
  grid-area: btn;
  height: max-content;
  margin-top: 10px;
  grid-area: btn;
`;

export const FormGroup = styled(Form.Group)`
  margin-bottom: 0px;
  display: grid;
  grid-template-areas: 'input btn';
  grid-template-columns: auto;
`;

export const ButtonContainer = styled.div`
  opacity: ${({ open }) => (open ? '1' : '0')};
  transition: opacity 250ms;
  transition-delay: 250ms;

  min-width: 200px;
  width: max-content;
  right: 0px;
  position: absolute;
  /* top: 0; */
  z-index: 3;
  pointer-events: auto;

  &:focus-within,
  &:focus,
  &:hover {
    opacity: 1;
    transition-delay: 0ms;
  }
`;

export const ListActionButton = styled.div`
  color: rgb(200, 200, 200);
  transition: color 250ms;
  cursor: pointer;
  display: flex;

  svg {
    color: rgb(150, 150, 150);
    transition: color 250ms;
    cursor: pointer;
    margin-right: 3px;
  }

  &:hover {
    color: rgb(250, 250, 250);

    svg {
      color: ${({ color }) => color || Colors.red};
    }
  }
`;

export const Label = styled(Form.Label)`
  input {
    margin-top: 5px;
    padding: 7px;
    background: #0000004f;
    color: rgb(200, 200, 200);
    border-top: none;
    border-right: none;
    border-left: none;
  }
`;

export const AddPlusIcon = styled(MdAdd)`
  /* &&& {
    position: absolute;
    top: 0;
    height: 100%;
    transform: translate(0);
    margin: 0;
    padding-left: 5px;
  } */
`;
