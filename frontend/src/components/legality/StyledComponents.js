import styled from "styled-components";

export const Container = styled.div`
  max-width: 800px;
  margin: auto;
  color: var(--videoTitle);

  a {
    color: white;
    text-decoration: underline;
    color: var(--videoTitle);
  }

  h2 {
    text-align: center;
    color: var(--videoTitle);
  }

  div {
    padding-top: 75px;
  }
`;

export const ListHeader = styled.h3`
  font-size: 1.2rem;
`;

export const EmailButtonAsLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: rgb(0, 219, 255);
`;
