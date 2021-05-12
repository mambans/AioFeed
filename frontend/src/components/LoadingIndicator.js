import React from 'react';
import ReactLoading from 'react-loading';
import { StyledLoadingContainer } from './sharedComponents/sharedStyledComponents';

/**
 * Returns a loading element.
 * @param {String} [text] - Optionall loading text
 * @param {Number} [height=150] - Height of the loading bars
 * @param {Number} [width=150] - Width of all loading bars/whole loading element
 * @param {String} [type='bars'] - Type of loading style ("blank" | "balls" | "bars" | "bubbles" | "cubes" | "cylon" | "spin" | "spinningBubbles" | "spokes")
 * @param {Object} [style] - Additional style object
 * @returns {Element} - JSX loading Element
 */
export default ({ text, height = 150, width = 150, type = 'bars', style }) => (
  <StyledLoadingContainer style={style || null}>
    <ReactLoading type={type} color={'#ffffff'} height={height} width={width} />
    {text && <h1>{text}</h1>}
  </StyledLoadingContainer>
);
