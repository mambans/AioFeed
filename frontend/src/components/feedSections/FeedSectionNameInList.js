import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import { AiFillEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdDelete, MdAdd } from 'react-icons/md';

import useInput from '../../hooks/useInput';
import { StyledButton, StyledListForm } from '../navigation/sidebar/UpdateTwitterLists';
import FeedSectionsContext from './FeedSectionsContext';
import ToolTip from '../sharedComponents/ToolTip';
import Rules from './Rules';

const InvalidError = styled.span`
  position: absolute;
  background: rgba(7, 18, 20, 0.85);
  border-radius: 5px 5px 0 0;
  padding: 2px 4px;
  text-align: center;
  left: 52px;
  font-size: 0.85rem;
  /* border-bottom: 2px solid #dc3545; */
`;

const FeedSectionNameInList = ({ section, setOverflow, style = {} }) => {
  const { name, enabled, rules } = section || {};
  const { createFeedSection, deleteFeedSection, toggleFeedSection, feedSections } =
    useContext(FeedSectionsContext);
  const { value: input, bind: bindInput, reset: resetInput } = useInput(name || '');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (Object.keys(feedSections).includes(input) && !name) return null;

    if (!name && input) {
      createFeedSection(input);
      resetInput();
    } else if (name) {
      deleteFeedSection(input);
      resetInput();
    }
  };

  return (
    <StyledListForm onSubmit={handleSubmit} style={style}>
      <Form.Group controlId='formGroupListName' style={{ marginBottom: '0' }}>
        <div style={{ display: 'flex' }}>
          {name && <Rules rules={rules} name={name} setOverflow={setOverflow} />}
          <Form.Control
            type='text'
            placeholder='name...'
            name='listName'
            required
            {...bindInput}
            isInvalid={Object.keys(feedSections).includes(input) && !name}
          />

          {name && (
            <ToolTip
              delay={{ show: 500, hide: 0 }}
              toltip={`${enabled ? `Disable feed` : `Enable feed`}`}
            >
              <StyledButton onClick={() => toggleFeedSection(name)}>
                {enabled ? (
                  <AiFillEye size={22} color='#ffffff' />
                ) : (
                  <AiOutlineEyeInvisible size={22} color='rgb(150,150,150)' />
                )}
              </StyledButton>
            </ToolTip>
          )}
          <ToolTip
            delay={{ show: 500, hide: 0 }}
            toltip={`${name ? `Remove list` : `Add new list`}`}
          >
            <StyledButton>
              {name ? (
                <MdDelete size={22} color='rgb(200,0,0)' />
              ) : (
                <MdAdd size={22} color='rgb(0,230,0)' />
              )}
            </StyledButton>
          </ToolTip>
        </div>
        {Object.keys(feedSections).includes(input) && !name && (
          <InvalidError>Section already exists</InvalidError>
        )}
      </Form.Group>
    </StyledListForm>
  );
};
export default FeedSectionNameInList;
