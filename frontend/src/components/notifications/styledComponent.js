import styled from "styled-components";

const Notification = styled.li`
  display: grid !important;
  /* grid-template-areas: "img name name" "img title title" "date date date"; */
  grid-template-areas: ${props =>
    props.type === "Offline"
      ? '"img name name" "img date date"'
      : '"img name name" "img title title" "date date date"'};
  min-height: ${props => (props.type === "Offline" ? "50px" : "100px")} !important;
  grid-template-columns: 20% 80%;
  opacity:  ${props => (props.type === "Offline" ? 0.2 : 1)};

  * {
    outline-color: transparent;
  }

  .profileImg {
    grid-area: img;
    display: flex;
    align-items: center;

    img {
      width: 46px;
      border-radius: 23px;
      grid-area: img;
      height: 46px;
      object-fit: cover;
    }
  }

  .name {
    color: white;
    grid-area: name;
    padding-bottom: ${props => (props.type === "Offline" ? null : "8px")}
  }

  .title {
    color: #c1c1c1;
    grid-area: title;
  }

  .date {
    /* color: #838181; */
    color: ${props => (props.type === "Offline" ? "#ffffff" : "#838181")};
    /* grid-area: ${props => (props.type === "Offline" ? "title" : "date")}; */
    grid-area: date;
    font-size: 0.9rem;
    text-align: right;
    display: flex;
    justify-content: right;

    & > div:hover {
      #timeago {
        display: none;
      }

      #time {
        display: inline;
      }
    }

    #time {
      display: none;
    }
  }

  /* &:hover {
      #timeago {
        display: none;
      }

      #time {
        display: inline;
      }
    }

    #time {
      display: none;
    } */
`;

const UnseenNotifcationCount = styled.div`
  background-color: var(--unseenNotifcationCountBackground);
  height: 24px;
  width: 24px;
  border-radius: 50%;
  position: absolute;
  top: -14px;
  left: 27px;
  line-height: 24px;
  text-align: center;
`;

export { Notification, UnseenNotifcationCount };
