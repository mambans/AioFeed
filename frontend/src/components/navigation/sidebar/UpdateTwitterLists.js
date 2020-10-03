import React, { useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import styled from 'styled-components';
import { IoMdList } from 'react-icons/io';
import { FaTwitter } from 'react-icons/fa';
import { MdPlaylistAdd, MdDelete, MdAdd } from 'react-icons/md';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import useInput from './../../../hooks/useInput';
import FeedsContext from '../../feed/FeedsContext';
import AccountContext from '../../account/AccountContext';
import { getCookie } from '../../../util/Utils';

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

export default ({ style, id, index }) => {
  const { enableTwitter, setTwitterLists, twitterLists } = useContext(FeedsContext);
  const { username } = useContext(AccountContext);
  const { value: listName, bind: bindListName, reset } = useInput(id || '');

  const addList = async () => {
    const set = new Set(twitterLists);
    set.add(listName);
    const newArray = [...set];

    localStorage.setItem('Twitter-Lists', JSON.stringify(newArray));
    setTwitterLists(newArray);

    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/account/soft-update`, {
        username: username,
        columnValue: { Lists: newArray },
        columnName: 'TwitterPreferences',
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => {
        console.error(e);
      });

    reset();
  };

  const removeList = async () => {
    const set = new Set(twitterLists);
    set.delete(listName);
    const newArray = [...set];

    localStorage.setItem('Twitter-Lists', JSON.stringify(newArray));
    setTwitterLists(newArray);

    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
        username: username,
        columnValue: { Lists: newArray },
        columnName: 'TwitterPreferences',
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => {
        console.error(e);
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

  if (enableTwitter) {
    return (
      <StyledForm onSubmit={handleSubmit} style={{ ...style }}>
        <Form.Group controlId='formGroupListName' style={{ marginBottom: '0' }}>
          <div style={{ display: 'flex' }}>
            <OverlayTrigger
              key={`${id}-${index}-icon` || 'nolist'}
              placement={'bottom'}
              delay={{ show: 500, hide: 0 }}
              overlay={
                <Tooltip id={`tooltip-${'bottom'}`}>{`${id ? `Remove list` : `New list`}`}</Tooltip>
              }
            >
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
            </OverlayTrigger>
            <Form.Control
              type='text'
              placeholder='12345...'
              name='listName'
              required
              // isInvalid={!listName}
              {...bindListName}
            />
            {/* <Form.Control.Feedback type='invalid'>Enter</Form.Control.Feedback> */}
            <OverlayTrigger
              key={`${id}-${index}-button` || 'nolist'}
              placement={'bottom'}
              delay={{ show: 500, hide: 0 }}
              overlay={
                <Tooltip id={`tooltip-${'bottom'}`}>{`${
                  id ? `Remove list` : `Add new list`
                }`}</Tooltip>
              }
            >
              <StyledButton>
                {id ? (
                  <MdDelete size={22} color='rgb(200,0,0)' />
                ) : (
                  <MdAdd size={22} color='rgb(0,230,0)' />
                )}
              </StyledButton>
            </OverlayTrigger>
          </div>
        </Form.Group>
      </StyledForm>
    );
  }
  return null;
};
