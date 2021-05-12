import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import FollowUnfollowBtn from './vods/VodsFollowUnfollowBtn';

const StyledModal = styled(Modal)`
  .modalBackdrop {
    opacity: 0.3;
  }

  .ulContainer {
    font-size: 1.15rem;
    line-height: 2rem;
    padding: 15px;
    text-align: start;
    color: rgb(245, 245, 245);
    overflow-y: scroll;
    scrollbar-color: #f0f0f0 rgba(0, 0, 0, 0) !important;
    scrollbar-width: thin !important;
  }

  .modal-body {
    background: rgba(12, 12, 17, 0.95);
    border-radius: 10px;
    text-align: center;

    button {
      margin: 5px 15px;
    }

    p#cancel {
      margin: 10px 0 0 0;
      b {
        cursor: pointer;
      }
    }
  }
`;

export default ({ channel, setShowUnsubscribeVods, ...props }) => {
  // const [show, setShow] = useState(props?.show);

  return (
    <StyledModal
      {...props}
      show={props.show}
      onHide={() => setShowUnsubscribeVods(false)}
      size='lg'
      centered
    >
      <Modal.Body>
        <h4>Unscubscribe from {channel} vods.</h4>
        <p>Do you also want to unsubscribe from {channel} vods?</p>
        <FollowUnfollowBtn
          channel={channel}
          type='success'
          padding='0.5rem 0.75rem'
          unfollowStream={() => {
            setShowUnsubscribeVods(false);
            props.UnfollowStream();
          }}
          text={
            <span style={{ marginLeft: '10px' }}>
              <b id='yes'>Yes </b>, remove the vods.
            </span>
          }
        />
        <Button
          variant='danger'
          onClick={() => {
            setShowUnsubscribeVods(false);
            props.UnfollowStream();
          }}
        >
          <b>No </b>, keep the vods.
        </Button>
        <p id='cancel'>
          <b onClick={() => setShowUnsubscribeVods(false)}>Cancel</b> unfollow and stay followed to{' '}
          {channel}
        </p>
      </Modal.Body>
    </StyledModal>
  );
};
