import { Button } from 'react-bootstrap';
import React, { useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import FeedsContext from '../../feed/FeedsContext';
import { FeedSizeBtn, FeedSizeIcon } from '../../sharedStyledComponents';

export const StyledGameListElement = styled.li`
  justify-content: unset;
  cursor: pointer;

  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    border-radius: 3px;
  }

  a {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 262px;
    color: ${({ selected }) => (selected ? '#ffffff' : 'inherit')};
    font-weight: ${({ selected }) => (selected ? 'bold' : 'unset')};
  }
`;

export const StyledShowAllButton = styled.li`
  &&& {
    justify-content: center;
  }
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
`;

export const GameListUlContainer = styled.ul`
  background: var(--popupListsBackground);
  scrollbar-color: #f0f0f0 rgba(0, 0, 0, 0);
  scrollbar-width: thin;
  border-radius: 0 0 10px 10px;
  border: none;

  transform: translate3d(0, 0, 0);
  color: rgb(230, 230, 230);
  list-style: none;
  padding-left: 0.75rem;
  margin: 0;
  position: ${({ position }) => position || 'absolute'};
  box-shadow: var(--refreshButtonShadow);
  width: 310px;

  max-height: 485px;
  height: 485px;
  overflow: scroll;
  overflow-x: scroll;
  overflow-x: hidden;
  z-index: 5;

  p:nth-child(1) {
    text-align: center;
    font-size: 0.9rem;
    font-weight: bold;
    margin: 9px 0;
    color: var(--VideoContainerLinks);
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: thin solid #1e1616;
    padding: 5px 0;
  }

  a {
    transition: color 50ms, font-weight 50ms;
    color: inherit;

    &:hover {
      color: #ffffff;
    }
  }
`;

export const TypeListUlContainer = styled.ul`
  background: var(--popupListsBackground);
  scrollbar-color: #f0f0f0 rgba(0, 0, 0, 0);
  scrollbar-width: thin;
  border-radius: 0 0 10px 10px;
  border: none;

  color: white;
  list-style: none;
  padding-left: 0.75rem;
  margin: 0;
  position: absolute;
  box-shadow: var(--refreshButtonShadow);
  width: 150px;

  overflow: scroll;
  overflow-x: hidden;
  z-index: 3;

  li,
  a {
    display: grid;
    grid-template-columns: 35% auto;
    align-items: center;
    border-bottom: thin solid #1e1616;
    padding: 5px 0;
    min-height: 43px;
    cursor: pointer;
  }

  a {
    color: rgb(200, 200, 200);

    &:hover {
      color: #ffffff;
    }
  }
`;

export const pulseLight = keyframes`
  0% {background: #36393fd1;}
  40% {background: #464d54;}
  100% {background: #36393fd1;}
`;

export const StyledLoadingListElement = styled.li`
  height: 42px;

  div {
    height: 15px;
    width: 100%;
    border-radius: 8px;
    background: #36393fd1;
    animation: ${pulseLight} 2s linear infinite;
  }
`;

export const TypeButton = styled(Button).attrs({ variant: 'dark' })`
  width: 150px;
  background-color: rgba(20, 23, 25, 0.5);
  display: grid;
  grid-template-columns: 35% auto;
  text-align: unset;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  text-transform: capitalize;

  &:hover,
  &:active,
  &:focus {
    background-color: rgba(20, 23, 25, 0.9);
  }

  svg {
    padding-right: 5px;
  }
`;

export const TopDataSortButtonsContainer = styled.div`
  display: flex;
  justify-content: right;
  width: 675px;
  min-width: 675px;

  div {
    margin-left: 10px;
  }

  button {
    height: 42px;
  }
`;

export const TopStreamsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const StyledContainer = styled.div`
  width: ${({ size }) => (Math.floor((window.innerWidth - 150) / size) % size) * size + 'px'};
  margin: auto;
  position: relative;
  transition: width 500ms;
`;

export const Container = ({ children }) => {
  const { feedSize, feedSizesObj, setFeedSize } = useContext(FeedsContext);

  const sizeBtnOnClick = () => {
    setFeedSize((cr) => {
      if (cr === 'small') {
        localStorage.setItem('Feed-size', 'default');
        return 'default';
      }
      localStorage.setItem('Feed-size', 'small');
      return 'small';
    });
  };

  return (
    <StyledContainer size={feedSizesObj.totalWidth}>
      <FeedSizeBtn>
        <FeedSizeIcon size={24} active={String(feedSize === 'default')} onClick={sizeBtnOnClick} />
        <FeedSizeIcon size={18} active={String(feedSize === 'small')} onClick={sizeBtnOnClick} />
      </FeedSizeBtn>
      {children}
    </StyledContainer>
  );
};
