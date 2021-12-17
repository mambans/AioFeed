import React, { useContext, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import {
  AllFiltersContainer,
  ChannelNameHeader,
  ChannelRulesList,
  CloseListBtn,
  ListItems,
  OpenListBtn,
  StyledAllFiltersListContainer,
} from './StyledComponents';
import { Row } from './index';
import './CustomFilter.scss';
import useClicksOutside from '../../../hooks/useClicksOutside';
import CustomFilterContext from './CustomFilterContext';
import API from '../../navigation/API';

const AllFiltersListContainer = ({ setOpen, open, uploadNewFiltersTimer }) => {
  const { filters, setFilters } = useContext(CustomFilterContext);
  const ref = useRef();
  // useLockBodyScroll(true);
  useClicksOutside(ref, () => setOpen(false), Boolean(open));

  const clearAllFilters = () => {
    setFilters({});
    API.addCustomfilters({});
  };

  return (
    <StyledAllFiltersListContainer ref={ref}>
      <Button variant='dark' onClick={clearAllFilters} style={{ margin: '5px', marginBottom: '0' }}>
        Clear all
      </Button>
      <CloseListBtn onClick={() => setOpen(false)} size={26}>
        x
      </CloseListBtn>
      <ListItems>
        <ChannelNameHeader color='#0e9f0e'>New filter</ChannelNameHeader>
        <Row
          enableFormControll={true}
          setFilters={setFilters}
          uploadNewFiltersTimer={uploadNewFiltersTimer}
          style={{ paddingBottom: '10px' }}
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
                <ChannelNameHeader>{channelName}</ChannelNameHeader>
                {filters[channelName]?.map((rule, index) => (
                  <Row
                    key={`${channelName}-${index}`}
                    rule={rule}
                    setFilters={setFilters}
                    channel={channelName}
                    enableFormControll={true}
                    uploadNewFiltersTimer={uploadNewFiltersTimer}
                  />
                ))}
              </ChannelRulesList>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ListItems>
    </StyledAllFiltersListContainer>
  );
};

const AllFilterList = () => {
  const [open, setOpen] = useState();
  const uploadNewFiltersTimer = useRef();

  return (
    <AllFiltersContainer>
      <OpenListBtn
        onClick={() => setOpen(true)}
        size={26}
        show={String(open)}
        style={{ marginRight: '15px' }}
      />
      {open && (
        <AllFiltersListContainer
          open={open}
          setOpen={setOpen}
          uploadNewFiltersTimer={uploadNewFiltersTimer}
        ></AllFiltersListContainer>
      )}
    </AllFiltersContainer>
  );
};
export default AllFilterList;
