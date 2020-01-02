import styled from "styled-components";

const HeaderContainerTwitchLive = styled.div`
  border-bottom: var(--subFeedHeaderBorder);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 7px;
  width: var(--feedsWidth) !important;
  margin: var(--feedsMargin);

  @media screen and (max-width: 2560px) {
    margin: 25px 0 0 360px;
    width: 82%;
  }

  @media screen and (max-width: 1920px) {
    width: 73.5%;
    margin: 25px 7.5% 0 19%;
  }
`;

const StyledLoadmore = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto min-content auto;
  align-items: center;

  div {
    background: #5a5c5e;
    height: 2px;
  }

  p {
    width: max-content;
    cursor: pointer;
    margin: 0;
    font-weight: bold;
    color: #a4a4a4;
    text-shadow: 0px 0px 5px black;
    padding: 10px 20px;

    &:hover {
      color: white;
    }
  }
`;

export { HeaderContainerTwitchLive, StyledLoadmore };
