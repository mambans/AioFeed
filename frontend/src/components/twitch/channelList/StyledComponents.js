import styled from "styled-components";

export const ChannelListLi = styled.li`
  a {
    padding: 0;
    font-size: unset;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--VideoContainerLinksHover);

    img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      border-radius: 3px;
    }
  }
  div.ButtonContianer {
    display: flex;
  }
`;
