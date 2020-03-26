import styled from "styled-components";

export const Notification = styled.li`
  display: grid !important;
  grid-template-areas: ${({ type }) =>
    type === "Offline"
      ? '"img name name" "img date date"'
      : '"img name name" "img title title" "date date date"'};
  min-height: ${({ type }) => (type === "Offline" ? "50px" : "100px")} !important;
  grid-template-columns: 20% 80%;
  opacity: ${({ type }) => (type === "Offline" ? 0.2 : 1)};

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
    padding-bottom: ${({ type }) => (type === "Offline" ? null : "8px")};
  }

  .title {
    color: #c1c1c1;
    grid-area: title;
  }

  .date {
    color: ${({ type }) => (type === "Offline" ? "#ffffff" : "#838181")};
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
`;

export const UnseenNotifcationCount = styled.div`
  background-color: var(--unseenNotifcationCountBackground);
  height: 24px;
  width: 24px;
  border-radius: 50%;
  position: absolute;
  top: -7px;
  left: 20px;
  line-height: 24px;
  text-align: center;
`;
