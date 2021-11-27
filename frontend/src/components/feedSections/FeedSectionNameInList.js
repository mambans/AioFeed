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
  const { title, enabled, rules, id } = section || {};
  const {
    createFeedSection,
    deleteFeedSection,
    toggleFeedSection,
    feedSections,
    editFeedSectionTitle,
  } = useContext(FeedSectionsContext);
  const { value: input, bind: bindInput, reset: resetInput } = useInput(title || '');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (Object.keys(feedSections).includes(input) && !id) return null;

    if (!id && input) {
      createFeedSection(input);
      resetInput();
    } else if (id) {
      editFeedSectionTitle({ id, title: input });
    }
  };

  return (
    <StyledListForm onSubmit={handleSubmit} style={style}>
      <Form.Group controlId='formGroupListName' style={{ marginBottom: '0' }}>
        <div style={{ display: 'flex' }}>
          {id && <Rules rules={rules} name={title} setOverflow={setOverflow} id={id} />}
          <Form.Control
            type='text'
            placeholder='name...'
            name='listName'
            required
            {...bindInput}
            isInvalid={Object.keys(feedSections).includes(input) && !id}
          />

          {id && (
            <ToolTip
              delay={{ show: 500, hide: 0 }}
              toltip={`${enabled ? `Disable feed` : `Enable feed`}`}
            >
              <StyledButton type='button' onClick={() => toggleFeedSection(id)}>
                {enabled ? (
                  <AiFillEye size={22} color='#ffffff' />
                ) : (
                  <AiOutlineEyeInvisible size={22} color='rgb(150,150,150)' />
                )}
              </StyledButton>
            </ToolTip>
          )}
          <ToolTip delay={{ show: 500, hide: 0 }} toltip={`${id ? `Remove list` : `Add new list`}`}>
            {id ? (
              <StyledButton type='button' onClick={() => deleteFeedSection(id)}>
                <MdDelete size={22} color='rgb(200,0,0)' />
              </StyledButton>
            ) : (
              <StyledButton>
                <MdAdd size={22} color='rgb(0,230,0)' />
              </StyledButton>
            )}
          </ToolTip>
        </div>
        {Object.keys(feedSections).includes(input) && !id && (
          <InvalidError>Section already exists</InvalidError>
        )}
      </Form.Group>
    </StyledListForm>
  );
};
export default FeedSectionNameInList;
