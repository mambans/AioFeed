import styled from "styled-components";

export const StyledFooterContainer = styled.div`
  display: flex;
  background-color: hsla(0, 0%, 0%, 0.5);
  padding: 15px;
  text-align: center;
  // border-top: thin solid #352f2f;
  box-shadow: var(--footerShadow);
  margin-top: var(--footerMargin);
  border-top: 2px solid #53463f;

  a,
  button {
    font-size: 16px !important;
    color: var(--footerLinkColor);

    &:hover {
      color: var(--footerLinkHoverColor);
    }
  }

  ul a {
    font-size: 16px;

    width: max-content;
    padding: 0;
    line-height: 30px;
    display: flex;
  }

  div {
    width: 33%;
    display: flex;
    justify-content: center;

    &#centerText {
      flex-direction: column;
    }

    ul {
      list-style-type: none;
    }
  }

  ul li i {
    margin-left: -28px;
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
`;
