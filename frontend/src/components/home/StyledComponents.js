import styled from 'styled-components';

export const BlurOverlay = styled.div`
  height: calc(100vh + 100px);
  width: 100%;
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
  top: 0px;
`;

export const TopBlurOverlay = styled.div`
  height: 60px;
  width: 100%;
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
  z-index: 1000;
`;

export const LogoText = styled.div`
  display: flex;
  justify-content: center;

  h1 {
    color: var(--textColor1);
    font-size: 8rem;
    margin: 0;
    height: 255px;
    display: flex;
    align-items: flex-end;
    letter-spacing: 5px;
  }

  p {
    color: var(--textColor1);
    text-align: left;
    width: 410px;
    text-align: center;
  }
`;

export const WelcomeContainer = styled.div`
  text-align: center;
  position: absolute;
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;

  img#logo {
    width: 300px;
    height: 300px;
    margin-right: -60px;
    box-shadow: 0 0 5px black;
    border-radius: 50%;
  }
`;
