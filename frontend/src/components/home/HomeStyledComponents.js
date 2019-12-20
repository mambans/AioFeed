import styled from "styled-components";

const BlurOverlay = styled.div`
  height: calc(100vh - 65px);
  width: 100vw;
  /* position: fixed; */
  position: absolute;
  background: no-repeat center center fixed;
  background-attachment: fixed;
  background-image: none;
  background-size: auto;
  background-attachment: fixed;
  background-image: var(--backgroundImg);
  object-fit: cover;
  background-size: cover;
  padding: 0 !important;
  filter: blur(5px);
  top: 65px;
`;

const TopBlurOverlay = styled.div`
  height: 65px;
  width: 100vw;
  /* position: fixed; */
  position: absolute;
  background: no-repeat center center fixed;
  background-attachment: fixed;
  background-image: none;
  background-size: auto;
  background-attachment: fixed;
  background-image: var(--backgroundImg);
  object-fit: cover;
  background-size: cover;
  padding: 0 !important;
  filter: blur(5px);
  top: 0;
`;

const LogoText = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: center; */

  /* h1 {
    margin-top: 65px;
    font-size: 8rem;
  } */

  /* display: grid;
  grid-template-columns: 300px auto;
  grid-template-rows: 250px 50px;
  grid-template-areas: "logo name" "logo desc";
  justify-content: center; */
  display: flex;

  img {
    /* grid-area: logo; */
  }

  h1 {
    font-size: 8rem;
    margin: 0;
    height: 255px;
    display: flex;
    align-items: end;
    /* grid-area: name; */
    letter-spacing: 5px;
  }

  p {
    /* grid-area: desc; */
    text-align: left;
    width: 410px;
    text-align: center;
  }
`;

export { BlurOverlay, LogoText, TopBlurOverlay };
