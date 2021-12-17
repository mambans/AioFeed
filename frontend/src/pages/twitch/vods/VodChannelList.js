import { Form, Button } from 'react-bootstrap';
import React, { useState, useContext, useRef } from 'react';
import { MdFormatListBulleted } from 'react-icons/md';
import { CSSTransition } from 'react-transition-group';

import AccountContext from './../../account/AccountContext';
import LoadingList from './../LoadingList';
import VodChannelListElement from './VodChannelListElement';
import useInput from './../../../hooks/useInput';
import AddVodChannel from './AddVodChannel';
import useLockBodyScroll from '../../../hooks/useLockBodyScroll';
import useSyncedLocalState from '../../../hooks/useSyncedLocalState';
import { VodChannelListPopup } from './StyledComponents';
import { VodChannelListPopupTrigger } from './StyledComponents';
import ToolTip from '../../../components/tooltip/ToolTip';
import { AddToListModalTrigger } from '../../sharedComponents/sharedStyledComponents';
import useClicksOutside from '../../../hooks/useClicksOutside';

const VodChannelList = () => {
  const { authKey, username } = useContext(AccountContext);
  const [channels, setChannels] = useSyncedLocalState('TwitchVods-Channels', []);
  const [validated, setValidated] = useState(false);
  const [open, setOpen] = useState(false);
  const { value: channel, bind: bindchannel, reset: resetchannel } = useInput('');
  const triggerRef = useRef();
  const popupRef = useRef();
  useLockBodyScroll(open);
  useClicksOutside([popupRef, triggerRef], () => setOpen(false), open);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const form = evt.currentTarget;
    if (form.checkValidity() === false) {
      evt.preventDefault();
      evt.stopPropagation();
    } else {
      setValidated(true);
      AddVodChannel({ channel, channels, setChannels, username, authKey });

      resetchannel();
    }
  };

  return (
    <>
      <VodChannelListPopupTrigger onClick={() => setOpen((c) => !c)} ref={triggerRef}>
        <ToolTip
          placement={'left'}
          delay={{ show: 1000, hide: 0 }}
          tooltip={'Add/remove Twitch channels to fetch vods from'}
        >
          <AddToListModalTrigger variant='outline-secondary'>
            <MdFormatListBulleted size={22} />
          </AddToListModalTrigger>
        </ToolTip>
      </VodChannelListPopupTrigger>
      <CSSTransition in={open} timeout={750} classNames='fade-750ms' unmountOnExit>
        <VodChannelListPopup ref={popupRef}>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId='formGroupChannel'>
              <Form.Control
                type='text'
                placeholder='Channel name..'
                required
                {...bindchannel}
                isInvalid={!channel}
                style={{ marginTop: '5px' }}
              />
              <Button type='submit' variant='primary' style={{ width: '100%', padding: '5px' }}>
                Add
              </Button>
            </Form.Group>
          </Form>
          {channels.length > 0 ? (
            <ul>
              {channels.map((channel) => (
                <VodChannelListElement key={channel} channel={channel} param_Channels={channels} />
              ))}
            </ul>
          ) : (
            <LoadingList amount={8} />
          )}
        </VodChannelListPopup>
      </CSSTransition>
    </>
  );
};
export default VodChannelList;
