import styled from 'styled-components';
import YouTube from 'react-youtube';
import Moment from 'react-moment';
import { Alert } from 'react-bootstrap';

export const YoutubeIframe = styled(YouTube)`
  border: none;
  border-radius: 10px;
  z-index: 2;
  cursor: pointer;
  position: absolute;
  display: block;
  background-color: transparent;
  background: none;
`;

export const ChannelNameLink = styled.a`
  grid-area: info;
  justify-self: start;
  color: var(--textColor2);
`;

export const PublishedDate = styled(Moment)`
  grid-area: info;
  color: var(--textColor2);
  justify-self: end;
  padding-right: 10px;
`;

export const HeaderAlert = styled(Alert)`
  padding: 5px;
  opacity: 0.8;
  margin: 0;
  position: absolute;
  margin-left: 250px;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid;
  border-radius: 0;
  font-weight: bold;
  color: #ff291f;
`;
