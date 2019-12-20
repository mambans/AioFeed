import styled from "styled-components";

const Notification = styled.li`
  display: grid !important;
  grid-template-areas: "img name name" "img title title" "date date date";
  min-height: 100px !important;
  grid-template-columns: 20% 80%;

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
    padding-bottom: 8px;
  }

  .title {
    color: #c1c1c1;
    grid-area: title;
  }

  .date {
    color: #838181;
    grid-area: date;
    font-size: 0.9rem;
    text-align: right;
  }
`;

const UnseenNotifcationCount = styled.div`
  background-color: var(--unseenNotifcationCountBackground);
  height: 24px;
  width: 24px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -14px;
  left: 27px;
`;

export { Notification, UnseenNotifcationCount };
