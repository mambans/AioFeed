import styled from 'styled-components';
import { VideosContainer } from '../styledComponents';

export const StyledExpandSection = styled.div`
  transition: height 500ms, margin 500ms;
  height: ${({ height, collapsed }) => (collapsed === 'true' ? 0 : height)};
  padding: 0px;
  overflow: ${({ isOpened }) => (isOpened ? 'visible' : 'hidden')};
  width: inherit;
  /* transform: translate(0); */
  will-change: ${({ willChange }) => (willChange === 'true' ? 'height' : 'auto')};

  ${VideosContainer} {
    min-height: 0px !important;
  }

  * {
    /* visibility: ${({ isclosed }) => (isclosed ? 'hidden' : 'visible')}; */
    display: ${({ isclosed }) => (isclosed ? 'none' : 'ignore-asd')};
    pointer-events: ${({ isclosed }) => (isclosed ? 'none' : 'all')};
  }

  &.ListForm-appear {
    opacity: 0;
    height: 0;
    margin: 0 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms, padding 500ms;
  }

  &.ListForm-appear-active {
    opacity: 1;
    padding: 5px;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms, padding 500ms;
  }

  &.ListForm-appear-done {
    opacity: 1;
    padding: 5px;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms, padding 500ms;
  }

  &.ListForm-enter {
    opacity: 0;
    height: 0;
    margin: 0 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms, padding 500ms;
  }

  &.ListForm-enter-done {
    opacity: 1;
    padding: 5px;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms, padding 500ms;
  }

  &.ListForm-enter-active {
    opacity: 1;
    padding: 5px;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms, padding 500ms;
  }

  &.ListForm-exit {
    opacity: 1;
    padding: 5px;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms, padding 500ms;
  }

  &.ListForm-exit-active {
    opacity: 0;
    height: 0;
    margin: 0 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms, padding 500ms;
  }

  &.ListForm-exit-done {
    opacity: 0;
    height: 0;
    margin: 0 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms, padding 500ms;
  }
`;
