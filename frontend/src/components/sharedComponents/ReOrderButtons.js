import React from 'react';
import styled from 'styled-components';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import { getLocalstorage } from '../../util';

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

/**
 * Fetch and add following data to stream objects.
 * @param {Function} setOrder - setOrder state for seting the state
 * @param {String} feedName - Name of feed.
 * @returns {Element}
 */
const ReOrderButtons = ({ setOrder, feedName }) => {
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

export default ReOrderButtons;
