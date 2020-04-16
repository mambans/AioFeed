import styled from "styled-components";

export const ChannelListUl = styled.ul`
  li {
    button.VodButton,
    svg.StreamFollowBtn {
      opacity: 1;
    }
  }
`;

export const ChannelListLi = styled.li`
  a {
    padding: 0;
    font-size: unset;

    img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      border-radius: 3px;
    }
  }
`;
