import React, { useState } from 'react';
import { MdFormatListBulleted } from 'react-icons/md';
import Rule from './Rule';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { GrFormClose } from 'react-icons/gr';
const ITEM_HEIGHT = 60;

const Rules = ({ rules, name, id }) => {
  const [open, setOpen] = useState();

  const onToggle = () => {
    setOpen((c) => !c);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TriggerButton onClick={onToggle}>
        <MdFormatListBulleted size={22} />
      </TriggerButton>
      <StyledModal show={open} onHide={onClose} size='lg' centered width={'1200px'}>
        <Modal.Header>
          <Modal.Title centered>{name}</Modal.Title>
          <CloseBtn onClick={onClose}>
            <GrFormClose size={35} />
          </CloseBtn>
        </Modal.Header>
        <Modal.Body>
          <Rule height={ITEM_HEIGHT} name={name} id={id} index={0} />
          <TransitionGroup component={null}>
            {rules?.map((rule, index) => {
              return (
                <CSSTransition classNames='ListForm' key={rule.id} timeout={500} unmountOnExit>
                  <Rule height={ITEM_HEIGHT} rule={rule} name={name} id={id} index={index + 1} />
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </Modal.Body>
      </StyledModal>
    </>
  );
};
export default Rules;
const TriggerButton = styled.div`
  cursor: pointer;
  &,
  svg {
    transition: color 250ms, scale 250ms;
    color: rgb(150, 150, 150);
  }

  &:hover {
    transform: scale(1.1);
    svg {
      color: #ffffff;
    }
  }
`;

const CloseBtn = styled.div`
  cursor: pointer;
  transition: opacity 250ms;
  opacity: 0.8;
  path {
    stroke: #ffffff;
  }

  &:hover {
    opacity: 1;
  }
`;

const StyledModal = styled(Modal)`
  .modal-dialog {
    max-width: ${({ width }) => width || '800px'};
    width: ${({ width }) => width || '800px'};
  }
`;
