import React, { useContext, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { MdExpandMore } from 'react-icons/md';
import NavigationContext from '../NavigationContext';
import { ToggleButtonsContainerHeader } from './StyledComponents';
import { ExpandSection } from '../../sharedComponents/sharedStyledComponents';
import useLocalStorageState from '../../../hooks/useLocalStorageState';

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
  const ref = useRef();
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
      <ExpandSection
        height={ref.current?.getBoundingClientRect()?.height}
        expanded={String(expanded)}
        isclosed={String(isclosed)}
        isOpened={String(isOpened)}
      >
        <div ref={ref}>
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
        </div>
      </ExpandSection>
    </div>
  );
};
export default SidebarExpandableSection;
