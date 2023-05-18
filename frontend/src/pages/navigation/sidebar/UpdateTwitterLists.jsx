import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import { IoMdList } from 'react-icons/io';
import { FaTwitter } from 'react-icons/fa';
import { MdPlaylistAdd, MdDelete, MdAdd } from 'react-icons/md';

import useInput from './../../../hooks/useInput';
import ToolTip from '../../../components/tooltip/ToolTip';
import API from '../API';
import TwitterContext from '../../twitter/TwitterContext';
import LogsContext from '../../logs/LogsContext';
import { StyledListForm, StyledButton } from '../../../components/styledComponents';
import Colors from '../../../components/themes/Colors';

const UpdateTwitterLists = ({ style, id }) => {
  const { setTwitterLists, twitterLists } = useContext(TwitterContext) || {};
  const { addLog } = useContext(LogsContext) || {};
  const { value: listName, bind: bindListName, reset } = useInput(id || '');

  const addList = async () => {
    const set = new Set(twitterLists);
    set.add(listName);
    const newArray = [...set];

    setTwitterLists(newArray);

    await API.addTwitterList(newArray);

    reset();
  };

  const removeList = async () => {
    const set = new Set(twitterLists);
    set.delete(listName);
    const newArray = [...set];

    setTwitterLists(newArray);

    await API.addTwitterList(newArray);
    addLog({
      title: `${listName} twitter list removed`,
      text: `${listName} twitter list removed`,
      icon: 'feedsection',
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (listName !== id) {
      addList();
    } else if (typeof id === 'string') {
      removeList();
    }
  };

  return (
    <StyledListForm onSubmit={handleSubmit} style={{ ...style }}>
      <Form.Group controlId='formGroupListName' style={{ marginBottom: '0' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'inline-flex' }}>
            <FaTwitter
              style={{ position: 'absolute', transform: 'translateX(-60%)' }}
              size={12}
              color={Colors.blue}
            />
            {id ? (
              <IoMdList size={22} color='#ffffff' />
            ) : (
              <MdPlaylistAdd size={22} color='ffffff' />
            )}
          </div>

          <Form.Control
            type='text'
            placeholder='12345...'
            name='listName'
            required
            {...bindListName}
          />
          <ToolTip delay={{ show: 500, hide: 0 }} toltip={`${id ? `Remove list` : `Add new list`}`}>
            <StyledButton>
              {id ? (
                <MdDelete size={22} color={Colors.red} />
              ) : (
                <MdAdd size={22} color={Colors.green} />
              )}
            </StyledButton>
          </ToolTip>
        </div>
      </Form.Group>
    </StyledListForm>
  );
};

export default UpdateTwitterLists;
