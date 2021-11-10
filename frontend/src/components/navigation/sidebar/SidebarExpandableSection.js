import React, { useContext, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { MdExpandMore } from 'react-icons/md';
import NavigationContext from '../NavigationContext';
import { ToggleButtonsContainerHeader } from './StyledComponents';
import { ExpandSection } from '../../sharedComponents/sharedStyledComponents';

const SidebarExpandableSection = ({
  title,
  items,
  renderItem,
  keyGetter,
  fixedTopItem = null,
  fixedBottomItem = null,
}) => {
  const { setOverflow } = useContext(NavigationContext);
  const [expanded, setExpanded] = useState(true);
  const timer = useRef();
  const [hide, setHide] = useState();

  const handleTimer = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setHide(true);
    }, 450);
  };

  const handleOnClick = () => {
    handleTimer();
    setExpanded((c) => {
      if (c) {
        handleTimer();
      } else {
        clearTimeout(timer.current);
        setHide(false);
      }
      return !c;
    });
  };

  return (
    <div style={{ padding: '5px' }}>
      <ToggleButtonsContainerHeader expanded={expanded} onClick={handleOnClick}>
        {title}
        <MdExpandMore />
      </ToggleButtonsContainerHeader>
      <ExpandSection
        height={60 + (items?.length ? items.length * 60 : 0)}
        expanded={String(expanded)}
        hide={String(hide)}
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
      </ExpandSection>
    </div>
  );
};
export default SidebarExpandableSection;
