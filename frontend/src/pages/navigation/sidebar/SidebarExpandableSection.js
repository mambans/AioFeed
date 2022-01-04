import React, { useContext, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { MdExpandMore } from 'react-icons/md';
import NavigationContext from '../NavigationContext';
import { ToggleButtonsContainerHeader } from './StyledComponents';
import useLocalStorageState from '../../../hooks/useLocalStorageState';
import ExpandableSection from '../../../components/expandableSection/ExpandableSection';

const SidebarExpandableSection = ({
  title,
  items,
  renderItem = () => {},
  keyGetter = (i) => i?.id,
  fixedTopItem = null,
  fixedBottomItem = null,
  children = null,
}) => {
  const { setOverflow } = useContext(NavigationContext);
  const [expanded, setExpanded] = useLocalStorageState(title + '-expandableSection', true);
  const closedTimer = useRef();
  const openedTimer = useRef();
  const [isclosed, setIsClosed] = useState(!expanded);
  const [isOpened, setIsOpened] = useState(expanded);

  const handleCloseTimer = () => {
    clearTimeout(closedTimer.current);
    closedTimer.current = setTimeout(() => {
      setIsClosed(true);
    }, 450);
  };
  const handleOpenTimer = () => {
    clearTimeout(openedTimer.current);
    openedTimer.current = setTimeout(() => {
      setIsOpened(true);
    }, 500);
  };

  const handleOnClick = () => {
    setExpanded((c) => {
      const n = !c;
      if (n) {
        clearTimeout(closedTimer.current);
        clearTimeout(openedTimer.current);
        setIsClosed(false);
        handleOpenTimer();
      } else {
        clearTimeout(closedTimer.current);
        clearTimeout(openedTimer.current);
        setIsOpened(false);
        handleCloseTimer();
      }
      return n;
    });
  };

  return (
    <div style={{ padding: '5px', marginTop: '15px' }}>
      <ToggleButtonsContainerHeader expanded={expanded} onClick={handleOnClick}>
        {title}
        <MdExpandMore />
      </ToggleButtonsContainerHeader>
      <ExpandableSection
        collapsed={!expanded}
        isclosed={isclosed}
        isOpened={isOpened}
        style={{ marginTop: `${!expanded ? 0 : 20}px` }}
      >
        {fixedTopItem}
        <TransitionGroup component={null}>
          {items?.map((item, index) => (
            <CSSTransition
              classNames='ListForm'
              key={keyGetter(item) || index}
              timeout={500}
              unmountOnExit
            >
              {renderItem(item, index, setOverflow)}
            </CSSTransition>
          ))}
        </TransitionGroup>
        {fixedBottomItem}
        {children}
      </ExpandableSection>
    </div>
  );
};
export default SidebarExpandableSection;