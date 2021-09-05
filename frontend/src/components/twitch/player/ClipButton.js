import React from 'react';

import { CreateClipButton } from './StyledComponents';
import TwitchAPI from '../API';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import { toast } from 'react-toastify';

const CreateAndOpenClip = async ({ streamInfo }) => {
  const Width = window.screen.width * 0.6;
  const Height = 920;
  const LeftPosition = (window.screen.width - Width) / 2;
  const TopPosition = (window.screen.height - Height) / 2;
  const settings = `height=${Height},width=${Width},top=${TopPosition},left=${LeftPosition},scrollbars,resizable,status,location,toolbar,`;

  await TwitchAPI.postClip({ broadcaster_id: streamInfo.user_id })
    .then((res) =>
      window.open(res.data.data[0].edit_url, `N| Clip - ${res.data.data[0].id}`, settings)
    )
    .catch((er) => {
      const { error, message, status } = er.response.data;
      if (
        error === 'Forbidden' &&
        message === 'User does not have permissions to Clip on this channel.' &&
        status === 403
      ) {
        toast.warning("You don't have permission to create clips on this channel.");
        return;
      }

      console.error('CreateAndOpenClip -> er', er);
    });
};

const ClipButton = ({ streamInfo }) => {
  useEventListenerMemo('keydown', keyboardEvents, window, streamInfo);

  const createClip = () => {
    CreateAndOpenClip({ streamInfo });
  };

  function keyboardEvents(e) {
    switch (e.key) {
      case 'c':
      case 'C':
        createClip();
        break;
      default:
        break;
    }
  }

  return <CreateClipButton title='Create clip (c)' disabled={!streamInfo} onClick={createClip} />;
};
export default ClipButton;
