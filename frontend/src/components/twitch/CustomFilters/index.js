import React, { useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useClicksOutside from '../../../hooks/useClicksOutside';
import useSyncedLocalState from '../../../hooks/useSyncedLocalState';
import { StyledListContainer, ListItems, OpenListBtn, CloseListBtn } from './StyledComponents';
import './CustomFilter.scss';

export default ({ channel, enableFormControll = false }) => {
  const [show, setShow] = useState(false);
  const OnClick = () => setShow((i) => !i);

  return (
    <>
      <OpenListBtn onClick={OnClick} show={String(show)}></OpenListBtn>

      <CSSTransition in={show} timeout={250} classNames='customFilter' unmountOnExit>
        <ListContainer
          setShow={setShow}
          channel={channel}
          enableFormControll={enableFormControll}
        />
      </CSSTransition>
    </>
  );
};

const ListContainer = ({ setShow, channel, enableFormControll }) => {
  const [filters, setFilters] = useSyncedLocalState('CustomFilters', []);
  const listRef = useRef();

  useClicksOutside(listRef, (e) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    setShow(false);
  });

  return (
    <StyledListContainer ref={listRef}>
      <CloseListBtn onClick={() => setShow(false)}>X</CloseListBtn>
      <ListItems>
        <Row
          setFilters={setFilters}
          channel={channel}
          style={{ paddingBottom: '60px', height: 'unset' }}
          enableFormControll={enableFormControll}
        />
        <TransitionGroup component={null}>
          {filters[channel]?.map((rule) => (
            <CSSTransition
              key={`${channel}-${rule.match}-${rule.type}-${rule.action}`}
              timeout={250}
              classNames='filterRule'
              unmountOnExit
            >
              <Row
                key={`${channel}-${rule.match}-${rule.type}-${rule.action}`}
                rule={rule}
                setFilters={setFilters}
                channel={channel}
                enableFormControll={enableFormControll}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ListItems>
    </StyledListContainer>
  );
};

const Row = ({
  rule,
  setFilters,
  // streamInfo: { channel } = {},
  channel,
  style = {},
  enableFormControll,
}) => {
  const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(''),
      bind: {
        value,
        onChange: (event) => {
          setValue(event.target.value);
        },
      },
    };
  };

  const { value: match, bind: bindMatch, reset: resetMatch } = useInput(rule?.match || '');
  const { value: type, bind: bindType, reset: resetType } = useInput(rule?.type || 'game_name');
  const { value: action, bind: bindAction, reset: resetAction } = useInput(
    rule?.action || 'Blacklist'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Boolean(match)) return false;

    setFilters((curr = {}) => {
      const newRules = !rule
        ? [...(curr?.[channel] || []), { match, type, action }]
        : curr?.[channel].filter(
            (r) => !(r.match === rule.match && r.type === rule.type && r.action === rule.action)
          );
      return { ...curr, [channel]: newRules };
    });
    resetMatch();
    resetType();
    resetAction();
    return true;
  };

  return (
    <Container
      enableFormControll={enableFormControll}
      handleSubmit={handleSubmit}
      style={{ ...style }}
    >
      <Form.Control
        type='text'
        placeholder='words..'
        required
        {...bindMatch}
        spellCheck={false}
        style={{ gridArea: 'input' }}
      />
      <Form.Control as='select' {...bindType} style={{ gridArea: 'game' }} size='sm'>
        <option disabled>Where to check</option>
        <option label='Game'>game_name</option>
        <option>Title</option>
      </Form.Control>
      <Form.Control as='select' {...bindAction} style={{ gridArea: 'filter' }} size='sm'>
        <option disabled>Action</option>
        <option>Blacklist</option>
        <option>Whitelist</option>
      </Form.Control>
      <Button
        type='submit'
        form='CustomFilterForm'
        variant={!rule ? 'primary' : 'danger'}
        onClick={handleSubmit}
        size='sm'
        style={{ gridArea: 'button', alignItems: 'center', display: 'flex' }}
      >
        {!rule ? '+' : '-'}
      </Button>
    </Container>
  );
};

const Container = ({ enableFormControll, handleSubmit, style, children }) => {
  if (enableFormControll) {
    return (
      <Form
        noValidate
        variant='primary'
        onSubmit={handleSubmit}
        id='CustomFilterForm'
        style={{ ...style }}
      >
        {children}
      </Form>
    );
  }
  return (
    <div className='form' style={{ ...style }}>
      {children}
    </div>
  );
};
