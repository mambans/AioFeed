import styled from "styled-components";

const Notification = styled.li`
  display: grid !important;
  grid-template-areas: "img name name" "img title title" "date date date";
  min-height: 100px !important;
  grid-template-columns: 20% 80%;

  .profileImg {
    grid-area: img;

    img {
      width: 40px;
      border-radius: 20px;
      grid-area: img;
      height: 40px;
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

export { Notification };
