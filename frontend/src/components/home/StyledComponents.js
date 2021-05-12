import styled from 'styled-components';

export const BlurOverlay = styled.div`
  &&& {
    padding: 0;
  }

  height: calc(100vh + 100px);
  width: 100%;
  position: absolute;
  background: no-repeat center center fixed;
  background-attachment: fixed;
  background-image: none;
  background-attachment: fixed;
  background-image: var(--backgroundImg);
  object-fit: cover;
  background-size: cover;
  filter: blur(5px);
  top: 0px;
`;

export const TopBlurOverlay = styled.div`
  &&& {
    padding: 0;
  }

  height: 60px;
  width: 100%;
  position: absolute;
  background: no-repeat center center fixed;
  background-attachment: fixed;
  background-image: none;
  background-attachment: fixed;
  background-image: var(--backgroundImg);
  object-fit: cover;
  background-size: cover;
  filter: blur(5px);
  top: 0;
  z-index: 1000;
`;

export const LogoText = styled.div`
  transform: translateY(-5vh);
  font-family: 'Montserrat', sans-serif;

  h1 {
    color: var(--textColor1);
    font-size: 5rem;
    margin: 0;
    align-items: flex-end;
    letter-spacing: 5px;
  }

  p {
    color: var(--textColor1);
    text-align: left;
    text-align: center;
    margin: 0;
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
    height: 30vh;
  }
`;

export const DevideLine = styled.div`
  width: 100%;
  height: 2px;
  background: white;
  margin: 10px;
  opacity: 0.3;
`;
