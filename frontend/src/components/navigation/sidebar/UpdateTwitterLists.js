import React, { useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { IoMdList } from 'react-icons/io';
import { FaTwitter } from 'react-icons/fa';
import { MdPlaylistAdd, MdDelete, MdAdd } from 'react-icons/md';

import useInput from './../../../hooks/useInput';
import FeedsContext from '../../feed/FeedsContext';
import ToolTip from '../../sharedComponents/ToolTip';
import API from '../API';

const StyledForm = styled(Form)`
  margin: 10px;

  &:hover,
  &:focus-within,
  &:focus {
    opacity: 1 !important;
  }

  input {
    color: rgb(200, 200, 200);
    background-color: transparent;
    border: none;
    padding: 0.1875rem 0.75rem;
    height: calc(1.5em + 0.5rem + 0px);
    border-bottom: 1px solid #ffffff;
    border-radius: 0;
  }

  &.twitterForm-appear {
    opacity: 0;
    height: 0;
    margin: 0 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.twitterForm-appear-active {
    opacity: 1;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.twitterForm-appear-done {
    opacity: 1;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.twitterForm-enter {
    opacity: 0;
    height: 0;
    margin: 0 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.twitterForm-enter-done {
    opacity: 1;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.twitterForm-enter-active {
    opacity: 1;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.twitterForm-exit {
    opacity: 1;
    height: 38px;
    margin: 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.twitterForm-exit-active {
    opacity: 0;
    height: 0;
    margin: 0 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }

  &.twitterForm-exit-done {
    opacity: 0;
    height: 0;
    margin: 0 10px !important;
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin-bottom 500ms;
  }
`;
const StyledButton = styled(Button).attrs({ type: 'submit', variant: 'secondary' })`
  &&& {
    border: none;
  }

  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  opacity: 0.5;
  transition: opacity 250ms, background 250ms;

  &:hover {
    opacity: 1;
    background: rgba(50, 50, 50, 0.25);
  }
`;

const UpdateTwitterLists = ({ style, id }) => {
  const { setTwitterLists, twitterLists } = useContext(FeedsContext) || {};
  const { value: listName, bind: bindListName, reset } = useInput(id || '');

  const addList = async () => {
    const set = new Set(twitterLists);
    set.add(listName);
    const newArray = [...set];

    localStorage.setItem('Twitter-Lists', JSON.stringify(newArray));
    setTwitterLists(newArray);

    await API.softUpdateAccount('TwitterPreferences', { Lists: newArray });

    reset();
  };

  const removeList = async () => {
    const set = new Set(twitterLists);
    set.delete(listName);
    const newArray = [...set];

    localStorage.setItem('Twitter-Lists', JSON.stringify(newArray));
    setTwitterLists(newArray);

    await API.updateAccount('TwitterPreferences', { Lists: newArray });
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
    <StyledForm onSubmit={handleSubmit} style={{ ...style }}>
      <Form.Group controlId='formGroupListName' style={{ marginBottom: '0' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'inline-flex' }}>
            <FaTwitter
              style={{ position: 'absolute', transform: 'translateX(-60%)' }}
              size={12}
              color='rgb(29, 161, 242)'
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
                <MdDelete size={22} color='rgb(200,0,0)' />
              ) : (
                <MdAdd size={22} color='rgb(0,230,0)' />
              )}
            </StyledButton>
          </ToolTip>
        </div>
      </Form.Group>
    </StyledForm>
  );
};

export default UpdateTwitterLists;
