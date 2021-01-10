import styled from 'styled-components';
import { MdFilterList, MdClose } from 'react-icons/md';
import React from 'react';

import useClicksOutside from '../../../hooks/useClicksOutside';

export const StyledListContainer = styled.div`
  position: absolute;
  background: var(--sidebarsBackgroundColor);
  z-index: 2;
  border-radius: 5px;
  right: 0;

  ul {
    padding-top: 50px;
  }

  .btn {
    padding: 0.25rem 0.5rem;
  }
`;
export const ListItems = styled.div`
  padding-top: 25px;
  padding-bottom: 10px;
  overflow: auto;
  /* max-height: 500px; */
  min-width: 300px;

  max-height: 75vh;

  form,
  .form {
    /* height: 105.6px; */
    height: 86.6px;
    display: flex;
    font-size: 0.9em;
    margin: 25px 10px;

    display: grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto 35px;
    grid-template-areas: 'channel channel channel' 'input input input' 'game filter button';
    grid-gap: 10px;

    .form-control {
      background-color: #35383a;
      color: #fef3f3;
      border: none;
      font-size: 1em;
    }
  }
`;

export const OpenListBtn = styled(MdFilterList)`
  cursor: pointer;
  height: inherit;
  color: rgb(225, 225, 225);
  transition: color 250ms;
  margin: 5px;
  margin-bottom: 0px;

  &&& {
    opacity: ${({ show }) => (show === 'true' ? '0' : '1')} !important;
  }

  &:hover {
    color: #ffffff;
  }
`;

export const CloseListBtn = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  right: 0;
  color: rgb(150, 150, 150);
  transition: color 250ms;
  margin: 5px;
  margin-bottom: 0px;

  &:hover {
    color: #ffffff;
  }
`;

export const AllFiltersContainer = styled.div`
  position: relative;

  .btn {
    padding: 0.25rem 0.5rem;
  }
`;
const StyledAllFiltersListContainer = styled.div`
  position: absolute;
  z-index: 2;
  border-radius: 5px;
  right: 0;
  top: 0;
  background: var(--sidebarsBackgroundColor);
  width: 20rem;
`;

export const AllFiltersListContainer = ({ children, setOpen, containerRef }) => {
  // useLockBodyScroll(true);
  useClicksOutside(containerRef, () => setOpen(false));

  return <StyledAllFiltersListContainer>{children}</StyledAllFiltersListContainer>;
};

export const ChannelRulesList = styled.div`
  margin-bottom: 50px;
`;
