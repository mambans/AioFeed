import styled from "styled-components";

const StyledNavSidebarTrigger = styled.div`
  align-items: center;
  cursor: pointer;
  margin-left: 20px;
  border-radius: 30px;
  height: inherit;
  display: flex;
  justify-content: center;

  &:hover {
    svg {
      opacity: 1;
    }

    img#NavigationProfileImage {
      border: 2px solid rgb(200, 200, 200);
      box-shadow: 0px 0px 15px #000000;
    }
  }

  img#NavigationProfileImage {
    /* margin-left: 20px; */
    border-radius: 80%;
    object-fit: cover;
    width: 52px;
    height: 80%;
    align-self: center;
    transition: ease-in-out 0.2s;

    border: 2px solid transparent;
    box-shadow: 0px 0px 10px #000000;

    /* &:hover {
      border: 2px solid rgb(200, 200, 200);
      box-shadow: 0px 0px 15px #000000;


    }
  } */
`;

const StyledLoginButton = styled.p`
  margin-top: 0;
  margin-bottom: 0;
  font-size: 1.15rem;
  margin-right: 15px;
`;

export { StyledNavSidebarTrigger, StyledLoginButton };
