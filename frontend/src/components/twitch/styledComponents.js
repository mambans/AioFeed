import styled from "styled-components";

const HeaderContainerTwitchLive = styled.div`
  border-bottom: var(--subFeedHeaderBorder);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 7px;
  width: var(--feedsWidth);
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

export { HeaderContainerTwitchLive };
