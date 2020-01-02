import styled from "styled-components";

const StyledGameListElement = styled.li`
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
  }
`;

const StyledShowAllButton = styled.li`
  cursor: pointer;
  justify-content: center !important;
  font-weight: bold;
  font-size: 1.1rem;
`;

export { StyledGameListElement, StyledShowAllButton };
