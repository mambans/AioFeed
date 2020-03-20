import styled from "styled-components";

const SidebarTitlePopup = styled.div`
  width: 325px;
  height: 62px;
  position: fixed;
  background: var(--sidebarBackground);
  z-index: 5;
  transition: ease-in-out 1s;
  z-index: -1;

  span {
    padding: 8px 0;
    width: inherit;
    height: inherit;
    display: block;
    line-height: 25px;
    color: rgb(200, 200, 200);
    font-size: 0.92rem;
    overflow: hidden;
  }

  div {
    height: 1px;
    background: #aaaaaa;
    width: 0px;
    transition: width 1s cubic-bezier(0.32, 0.5, 0.17, 0.6);
  }

  &:hover {
    div {
      width: 320px;
    }
  }
`;

export { SidebarTitlePopup };
