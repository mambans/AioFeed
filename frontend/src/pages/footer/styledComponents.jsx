import styled from 'styled-components';

export const StyledFooterContainer = styled.footer`
  display: flex;
  background-color: var(--footerBackground);
  padding: 15px;
  text-align: center;
  margin-top: 100px;
  border-top: 2px solid #53463f;
  /* max-height: 200px; */
  width: 100%;
  color: var(--textColor3);
  transition: width 750ms, margin 750ms;
  z-index: 1;
  position: relative;

  ul {
    display: flex;
    flex-flow: column wrap;
    margin: 0;
    justify-content: center;
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
    &&& {
      font-size: 16px;
    }
    cursor: pointer;
    display: flex;
    align-items: center;
    color: var(--textColor2);
    transition: color 200ms;

    &:hover {
      color: var(--textColor2Hover);
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

export const StyledCenterBottomText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--textColor2);

  & > * {
    padding: 0.5rem 1rem;
  }

  &&& {
    width: unset;
  }
`;
