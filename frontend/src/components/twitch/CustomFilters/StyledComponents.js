import styled from 'styled-components';
import { MdFilterList, MdClose } from 'react-icons/md';

export const StyledListContainer = styled.div`
  position: absolute;
  background: var(--sidebarsBackgroundColor);
  z-index: 2;
  border-radius: 5px;
  right: 0;

  ul {
    padding-top: 50px;
  }
`;
export const ListItems = styled.div`
  padding-top: 25px;
  padding-bottom: 10px;
  overflow: auto;
  max-height: 500px;
  min-width: 300px;

  form,
  .form {
    height: 105.6px;
    display: flex;
    font-size: 0.9em;
    margin: 25px 10px;

    display: grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto 35px;
    grid-template-areas: 'input input input' 'game filter button';
    grid-gap: 10px;

    .form-control {
      background-color: #35383a;
      color: #fef3f3;
      border: none;
      font-size: 1em;
    }
  }
`;

export const OpenListBtn = styled(MdFilterList).attrs({ size: 22 })`
  cursor: pointer;
  height: inherit;
  margin-right: 5px;
  color: rgb(225, 225, 225);
  transition: color 250ms;

  &&& {
    opacity: ${({ show }) => (show === 'true' ? '0' : '1')} !important;
  }

  &:hover {
    color: #ffffff;
  }
`;

export const CloseListBtn = styled(MdClose).attrs({ size: 22 })`
  cursor: pointer;
  position: absolute;
  right: 0;
  color: rgb(150, 150, 150);
  transition: color 250ms;

  &:hover {
    color: #ffffff;
  }
`;
