import React from 'react';
import styled from 'styled-components';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import { getLocalstorage } from '../util/Utils';

const StyledReOrderButtons = styled.div`
  align-content: center;
  display: grid;
  flex-direction: column;
  height: 40px;
  margin-left: 5px;

  svg {
    cursor: pointer;
    color: rgb(100, 100, 100);
    transition: color 250ms;

    &:hover {
      color: rgb(255, 255, 255);
    }
  }
`;

export default ({ setOrder, feedName }) => {
  const saveOrder = (order) =>
    localStorage.setItem(
      'FeedOrders',
      JSON.stringify({
        ...(getLocalstorage('FeedOrders') || {}),
        [feedName]: order,
      })
    );

  return (
    <StyledReOrderButtons>
      <IoIosArrowUp
        size={16}
        onClick={() =>
          setOrder((c) => {
            const newVal = c - 10;
            saveOrder(newVal);
            return newVal;
          })
        }
      />
      <IoIosArrowDown
        size={16}
        onClick={() =>
          setOrder((c) => {
            const newVal = c + 10;
            saveOrder(newVal);
            return newVal;
          })
        }
      />
    </StyledReOrderButtons>
  );
};
