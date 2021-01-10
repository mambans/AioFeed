import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  AllFiltersContainer,
  AllFiltersListContainer,
  ChannelRulesList,
  CloseListBtn,
  ListItems,
  OpenListBtn,
} from './StyledComponents';
import { Row } from './index';
import './CustomFilter.scss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useSyncedLocalState from '../../../hooks/useSyncedLocalState';

export default () => {
  const [open, setOpen] = useState();
  const [filters, setFilters] = useSyncedLocalState('CustomFilters', []);
  const ref = useRef();

  const clearAllFilters = () => setFilters([]);

  return (
    <AllFiltersContainer ref={ref}>
      <OpenListBtn onClick={() => setOpen(true)} size={26} show={String(open)} />
      {open && (
        <AllFiltersListContainer setOpen={setOpen} containerRef={ref}>
          <Button
            variant='dark'
            onClick={clearAllFilters}
            style={{ margin: '5px', marginBottom: '0' }}
          >
            Clear all
          </Button>
          <CloseListBtn onClick={() => setOpen(false)} size={26}>
            x
          </CloseListBtn>
          <ListItems>
            <Row
              enableFormControll={true}
              setFilters={setFilters}
              style={{ paddingBottom: '10px', borderBottom: '2px solid #4b4b4b', height: 'unset' }}
            />
            <TransitionGroup component={null}>
              {Object.keys(filters)?.map((channelName) => (
                <CSSTransition
                  key={`${channelName}`}
                  timeout={250}
                  classNames='filterRule'
                  unmountOnExit
                >
                  <ChannelRulesList>
                    {filters[channelName].map((rule, index) => (
                      <Row
                        key={`${channelName}-${index}`}
                        rule={rule}
                        setFilters={setFilters}
                        channel={channelName}
                        enableFormControll={true}
                        showChannelName={true}
                      />
                    ))}
                  </ChannelRulesList>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </ListItems>
        </AllFiltersListContainer>
      )}
    </AllFiltersContainer>
  );
};
