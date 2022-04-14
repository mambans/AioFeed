import React from 'react';

import { CreateClipButton } from './StyledComponents';
import TwitchAPI from '../API';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import { toast } from 'react-toastify';

const CreateAndOpenClip = async ({ user_id }) => {
  const Width = window.screen.width * 0.6;
  const Height = 920;
  const LeftPosition = (window.screen.width - Width) / 2;
  const TopPosition = (window.screen.height - Height) / 2;
  const settings = `height=${Height},width=${Width},top=${TopPosition},left=${LeftPosition},scrollbars,resizable,status,location,toolbar,`;

  await TwitchAPI.postClip({ broadcaster_id: user_id })
    .then((res) =>
      window.open(res.data.data[0].edit_url, `N| Clip - ${res.data.data[0].id}`, settings)
    )
    .catch((er) => {
      const { error, message, status } = er?.response?.data || {};
      if (error === 'Forbidden' && status === 403) {
        toast.warning(message.replace('User does', 'You do'));
        return;
      }

      console.error('CreateAndOpenClip -> er', er);
    });
};

const ClipButton = ({ streamInfo }) => {
  useEventListenerMemo(
    'keydown',
    keyboardEvents,
    document.querySelector('#MainContentContainer'),
    streamInfo
  );

  const createClip = async () => {
    const user_id =
      streamInfo.user_id ||
      (await TwitchAPI.getUser({
        login: streamInfo.user_name || streamInfo.login || streamInfo.user_login,
      }).then((res) => res.data.data[0].id));

    CreateAndOpenClip({ user_id });
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
