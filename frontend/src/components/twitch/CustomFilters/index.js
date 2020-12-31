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
          style={{ paddingBottom: '25px' }}
          enableFormControll={enableFormControll}
        />
        <TransitionGroup component={null}>
          {filters[channel]?.map((rule) => (
            <CSSTransition
              key={`${channel}-${rule.match}-${rule.type}-${rule.filter}`}
              timeout={250}
              classNames='filterRule'
              unmountOnExit
            >
              <Row
                key={`${channel}-${rule.match}-${rule.type}-${rule.filter}`}
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
  const { value: type, bind: bindType, reset: resetType } = useInput(rule?.type || 'Game');
  const { value: filter, bind: bindFilter, reset: resetFilter } = useInput(rule?.filter || 'Feed');
  // const { value: action, bind: bindAction, reset: resetAction } = useInput(
  //   rule?.action || 'Whitelist'
  // );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Boolean(match)) return false;

    setFilters((curr = {}) => {
      const newRules = !rule
        ? [...(curr?.[channel] || []), { match, type, filter }]
        : curr?.[channel].filter(
            // (r) => r.match !== rule.match && r.type !== rule.type && r.filter !== rule.filter
            (r) => !(r.match === rule.match && r.type === rule.type && r.filter === rule.filter)
          );
      return { ...curr, [channel]: newRules };
    });
    resetMatch();
    resetType();
    resetFilter();
    return true;
    // resetAction();
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
      <Form.Control as='select' {...bindFilter} style={{ gridArea: 'filter' }} size='sm'>
        <option disabled>What to filter </option>
        <option>Feed</option>
        <option>Update notis</option>
      </Form.Control>
      {/* <Form.Control as='select' {...bindAction} style={{ gridArea: 'blackwhitelist' }}>
        <option disabled>Black/whitelist</option>
        <option>Whitelist</option>
        <option>Blacklist</option>
      </Form.Control> */}
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
