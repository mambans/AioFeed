import React, { useRef } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';

import useInput from '../../hooks/useInput';
import { StyledListForm } from '../styledComponents';

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

const MyInput = ({
  name,
  item,
  add = () => {},
  edit = () => {},
  leftSide,
  rightSide,
  valid = () => true,
  style = {},
  error = 'Invalid name',
  readOnly,
  plaintext,
  children,
  placeholder = 'name...',
  onBlur,
  width,
} = {}) => {
  const { value: input, bind: bindInput, reset: resetInput } = useInput(name || '');
  const ref = useRef();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!valid(input)) return null;

    if (!name && input) {
      add(input);
      resetInput();
    } else if (name && item?.id) {
      edit({ id: item.id, title: input });
      ref.current.blur();
    }
  };

  return (
    <StyledListForm onSubmit={handleSubmit} style={style}>
      <Form.Group controlId='formGroupListName' style={{ marginBottom: '0' }}>
        <div style={{ display: 'flex' }}>
          {leftSide}
          <Form.Control
            ref={ref}
            readOnly={readOnly}
            plaintext={plaintext}
            type='text'
            placeholder={placeholder}
            name='listName'
            required
            {...bindInput}
            isInvalid={!valid(input)}
            onBlur={() => onBlur?.(input)}
            spellCheck={false}
            style={{ width }}
          />
          {rightSide}
        </div>
        {!valid(input) && <InvalidError>{error}</InvalidError>}
        {children}
      </Form.Group>
    </StyledListForm>
  );
};
export default MyInput;
