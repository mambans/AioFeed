import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import useInput from '../../hooks/useInput';
import { StyledButton, StyledListForm } from '../navigation/sidebar/UpdateTwitterLists';
import ToolTip from '../sharedComponents/ToolTip';
import { MdDelete, MdAdd } from 'react-icons/md';
import FeedSectionsContext from './FeedSectionsContext';

const StyledRule = styled.div`
  height: ${({ height }) => height}px;

  &.ListForm-appear {
    opacity: 0;
    height: 0;
    /* margin: 0 10px !important; */
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
  }

  &.ListForm-appear-active {
    opacity: 1;
    height: ${({ height }) => height}px;
    /* margin: 10px !important; */
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
  }

  &.ListForm-appear-done {
    opacity: 1;
    height: ${({ height }) => height}px;
    /* margin: 10px !important; */
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
  }

  &.ListForm-enter {
    opacity: 0;
    height: 0;
    /* margin: 0 10px !important; */
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
  }

  &.ListForm-enter-done {
    opacity: 1;
    height: ${({ height }) => height}px;
    /* margin: 10px !important; */
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
  }

  &.ListForm-enter-active {
    opacity: 1;
    height: ${({ height }) => height}px;
    /* margin: 10px !important; */
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
  }

  &.ListForm-exit {
    opacity: 1;
    height: ${({ height }) => height}px;
    /* margin: 10px !important; */
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
  }

  &.ListForm-exit-active {
    opacity: 0;
    height: 0;
    /* margin: 0 10px !important; */
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
  }

  &.ListForm-exit-done {
    opacity: 0;
    height: 0;
    /* margin: 0 10px !important; */
    transition: opacity 250ms, height 500ms, margin-top 500ms, margin 500ms;
  }
`;

const InputsContainer = styled.div`
  display: flex;

  input {
    margin: 0 5px;
  }
`;

const Rule = ({ rule, height, id }) => {
  const { addFeedSectionRule, deleteFeedSectionRule } = useContext(FeedSectionsContext);

  const { value: title, bind: bindTitle, reset: resetTitle } = useInput(rule?.title || '');
  const {
    value: category,
    bind: bindCategory,
    reset: resetCategory,
  } = useInput(rule?.category || '');
  const { value: channel, bind: bindChannel, reset: resetChannel } = useInput(rule?.channel || '');
  const {
    value: viewers,
    bind: bindViewers,
    reset: resetViewers,
  } = useInput(rule?.viewers || '', { type: 'number' });

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (
      Boolean(title || category || channel || viewers) &&
      Boolean(
        title?.toLowerCase() !== rule?.title?.toLowerCase() ||
          category?.toLowerCase() !== rule?.category?.toLowerCase() ||
          channel?.toLowerCase() !== rule?.channel?.toLowerCase() ||
          viewers !== rule?.viewers
      )
    ) {
      addFeedSectionRule(id, { title, category, channel, viewers, id: rule?.id });
      if (!rule?.id) {
        resetTitle();
        resetCategory();
        resetChannel();
        resetViewers();
      }
    }
  };

  const handleOnblur = (evt) => {
    if (rule?.id) handleSubmit(evt);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!rule?.id && Boolean(title || category || channel || viewers)) {
      addFeedSectionRule(id, { title, category, channel, viewers });
      resetTitle();
      resetCategory();
      resetChannel();
      resetViewers();
    }
  };
  const handleRemove = (e) => {
    e.preventDefault();
    deleteFeedSectionRule(id, rule);
  };

  const handleKeyDown = (ev) => ev.key === 'Enter' && handleSubmit(ev);

  return (
    <StyledRule height={height}>
      <StyledListForm onSubmit={handleSubmit}>
        <Form.Group
          controlId='formGroupListName'
          style={{ marginBottom: '0' }}
          onKeyDown={handleKeyDown}
        >
          {/* <Form.Label>asd</Form.Label> */}
          <InputsContainer>
            {/* <InputGroup className='mb-3'> */}
            <Form.Control
              type='text'
              placeholder='title..'
              name='title'
              {...bindTitle}
              onBlur={handleOnblur}
            />
            <Form.Control
              type='text'
              placeholder='category..'
              name='category'
              {...bindCategory}
              onBlur={handleOnblur}
            />
            <Form.Control
              type='text'
              placeholder='channel..'
              name='channel'
              {...bindChannel}
              onBlur={handleOnblur}
            />
            <Form.Control
              type='number'
              placeholder='viewers..'
              name='viewers'
              {...bindViewers}
              onBlur={handleOnblur}
            />
            <ToolTip
              delay={{ show: 500, hide: 0 }}
              toltip={`${rule?.id ? `Remove list` : `Add new list`}`}
            >
              {rule?.id ? (
                <StyledButton onClick={handleRemove} type='button'>
                  <MdDelete size={22} color='rgb(200,0,0)' />
                </StyledButton>
              ) : (
                <StyledButton onClick={handleAdd} type='button'>
                  <MdAdd size={22} color='rgb(0,230,0)' />
                </StyledButton>
              )}
            </ToolTip>
          </InputsContainer>
        </Form.Group>
      </StyledListForm>
    </StyledRule>
  );
};
export default Rule;
