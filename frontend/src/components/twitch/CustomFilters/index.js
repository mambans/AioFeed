import React, { useContext, useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useClicksOutside from '../../../hooks/useClicksOutside';
import { StyledListContainer, ListItems, OpenListBtn, CloseListBtn } from './StyledComponents';
import './CustomFilter.scss';
import CustomFilterContext from './CustomFilterContext';

import { Portal } from 'react-portal';
import { TransparentButton } from '../../sharedComponents/sharedStyledComponents';
import API from '../../navigation/API';

const CustomFilters = ({
  channel,
  enableFormControll = false,
  setOpenParent = () => {},
  openParent,
  videoContainerRef,
  show = true,
  style,
}) => {
  const { setFilters } = useContext(CustomFilterContext) || {};
  const uploadNewFiltersTimer = useRef();
  const btnRef = useRef();
  const OnClick = () => setOpenParent((cr) => !cr);
  const videoContainerPosotion = videoContainerRef?.current?.getBoundingClientRect();

  if (!show) return null;

  return (
    <>
      {setFilters && (
        <TransparentButton ref={btnRef} onClick={OnClick}>
          <OpenListBtn show={String(openParent)} size='1.4em' style={style} />
        </TransparentButton>
      )}

      <CSSTransition in={openParent} timeout={250} classNames='customFilter' unmountOnExit>
        <Portal>
          <ListContainer
            videoContainerPosotion={videoContainerPosotion}
            setShow={setOpenParent}
            channel={channel}
            enableFormControll={enableFormControll}
            uploadNewFiltersTimer={uploadNewFiltersTimer}
            btnRef={btnRef}
          />
        </Portal>
      </CSSTransition>
    </>
  );
};

const ListContainer = ({
  setShow,
  channel,
  enableFormControll,
  uploadNewFiltersTimer,
  videoContainerPosotion,
  btnRef,
}) => {
  const { filters, setFilters } = useContext(CustomFilterContext);
  const listRef = useRef();

  useClicksOutside([listRef, btnRef], (e) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    setShow(false);
    return false;
  });

  return (
    <StyledListContainer
      ref={listRef}
      top={videoContainerPosotion.bottom}
      left={videoContainerPosotion.left}
      width={videoContainerPosotion.width}
    >
      <CloseListBtn onClick={() => setShow(false)} size={22}>
        X
      </CloseListBtn>
      <ListItems>
        <Row
          setFilters={setFilters}
          channel={channel}
          style={{ paddingBottom: '10px', borderBottom: '2px solid #4b4b4b', height: 'unset' }}
          enableFormControll={enableFormControll}
          uploadNewFiltersTimer={uploadNewFiltersTimer}
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
                uploadNewFiltersTimer={uploadNewFiltersTimer}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ListItems>
    </StyledListContainer>
  );
};

export const Row = ({
  rule,
  setFilters,
  // streamInfo: { channel } = {},
  channel,
  style = {},
  enableFormControll,
  uploadNewFiltersTimer,
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

  const {
    value: channelName,
    bind: bindChannelName,
    reset: resetChannelName,
  } = useInput(channel || '');
  const { value: match, bind: bindMatch, reset: resetMatch } = useInput(rule?.match || '');
  const { value: type, bind: bindType, reset: resetType } = useInput(rule?.type || 'game_name');
  const {
    value: action,
    bind: bindAction,
    reset: resetAction,
  } = useInput(rule?.action || 'Blacklist');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Boolean(match)) return false;

    setFilters((curr = {}) => {
      const newRules = !rule
        ? [...(curr?.[channelName] || []), { match, type, action }]
        : curr?.[channelName].filter(
            (r) => !(r.match === rule.match && r.type === rule.type && r.action === rule.action)
          );

      const newFilters = { ...curr, [channelName]: newRules };
      if (!Boolean(newRules.length)) delete newFilters[channelName];

      clearTimeout(uploadNewFiltersTimer.current);
      uploadNewFiltersTimer.current = setTimeout(() => {
        API.addCustomfilters(newFilters);
      }, 5000);

      return newFilters;
    });
    resetMatch();
    resetType();
    resetAction();
    resetChannelName();
    return true;
  };

  return (
    <Container
      enableFormControll={enableFormControll}
      handleSubmit={handleSubmit}
      style={{ ...style }}
    >
      {!channel && (
        <Form.Control
          type='text'
          placeholder='channel..'
          required
          {...bindChannelName}
          spellCheck={false}
          style={{ gridArea: 'channel' }}
        />
      )}
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
        style={{ gridArea: 'button' }}
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
export default CustomFilters;
