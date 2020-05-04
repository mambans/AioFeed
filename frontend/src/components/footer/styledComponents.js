import styled from "styled-components";

export const StyledFooterContainer = styled.div`
  display: flex;
  background-color: var(--footerBackground);
  padding: 15px;
  text-align: center;
  box-shadow: var(--footerShadow);
  margin-top: var(--footerMargin);
  border-top: 2px solid #53463f;
  max-height: 200px;
  width: ${({ enableTwitter, location }) =>
    enableTwitter && (location === "/feed" || location === "/feed/")
      ? "calc(85vw - (25px + 10px))"
      : "100%"};
  color: var(--VideoContainerLinks);

  ul {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin: 0;
  }

  ul li {
    padding: 0 10px;
    i {
      margin-left: -28px;
    }
  }

  a,
  button,
  div.button {
    cursor: pointer;
    display: flex;
    align-items: center;

    font-size: 16px !important;
    color: var(--footerLinkColor);

    &:hover {
      color: var(--footerLinkHoverColor);
    }
  }

  ul a,
  div.button {
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 16px;
    width: max-content;
    padding: 0;
    line-height: 30px;
    display: flex;
  }

  div:not(.button) {
    width: 25%;
    display: flex;
    justify-content: center;

    &#centerText {
      flex-direction: column;
    }

    ul {
      list-style-type: none;
    }
  }
`;

export const StyledButtonLinks = styled.button`
  background: none;
  border: none;
  text-align: left;
  width: 100%;
  padding: 0;
`;

export const StyledCenterBottomText = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--VideoContainerLinks);
`;
