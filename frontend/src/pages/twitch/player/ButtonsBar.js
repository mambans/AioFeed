import React from 'react';
import { FaTwitch } from 'react-icons/fa';
import styled from 'styled-components';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import loginNameFormat from '../loginNameFormat';
import UserSchedule from '../schedule/UserSchedule';
import { AiFillSchedule } from 'react-icons/ai';
import ShowNavigationButton from '../../navigation/ShowNavigationButton';
import { StyledShowNavbarBtn } from './StyledComponents';
import { MdAccountBox } from 'react-icons/md';

const DEFAULT_SIZE = 20;

const ButtonsBar = ({ style, videoId, children, user, schedule = true, size }) => {
  return (
    <Wrapper
      style={style}
      size={size || DEFAULT_SIZE}
      // onClick={(e) => {
      //   e.stopImmediatePropagation();
      // }}
    >
      <ShowNavigationButton />
      {videoId && (
        <Button
          to={`https://twitch.tv/videos/${videoId}?redirect=false`}
          variant='darkTransparent '
        >
          <FaTwitch size={size || DEFAULT_SIZE} color='purple' />
        </Button>
      )}
      {loginNameFormat(user, true) && (
        <Button
          to={`https://twitch.tv/${loginNameFormat(user, true)}?redirect=false`}
          variant='darkTransparent '
        >
          <FaTwitch size={size || DEFAULT_SIZE} color='purple' />
        </Button>
      )}
      {loginNameFormat(user, true) && (
        <Button to={`/${loginNameFormat(user, true)}/page`} variant='darkTransparent '>
          <MdAccountBox size={size || DEFAULT_SIZE} color='white' />
        </Button>
      )}

      {schedule && (
        <Modal
          height={'70%'}
          trigger={
            <Button>
              <AiFillSchedule size={size || DEFAULT_SIZE} />
            </Button>
          }
        >
          <UserSchedule user={user} />
        </Modal>
      )}

      {children}
    </Wrapper>
  );
};
export default ButtonsBar;

const Wrapper = styled.div`
  border-radus: 1rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  box-shadow: ${({ shadowColor = 'rgb(50, 50, 50)' }) => `1px 1px 1px ${shadowColor}`};

  svg {
    width: ${(size) => size}px;
    height: ${(size) => size}px;
  }

  button {
    height: 45px;
    min-width: 45px;
  }

  &&& {
    ${StyledShowNavbarBtn} {
      margin: 0;
    }
  }
`;
