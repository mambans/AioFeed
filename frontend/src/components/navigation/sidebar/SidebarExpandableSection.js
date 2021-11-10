import React, { useContext, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { MdExpandMore } from 'react-icons/md';
import NavigationContext from '../NavigationContext';
import { ToggleButtonsContainerHeader } from './StyledComponents';
import { ExpandSection } from '../../sharedComponents/sharedStyledComponents';

const SidebarExpandableSection = ({
  title,
  items,
  renderItem = () => {},
  keyGetter = (i) => i?.id,
  fixedTopItem = null,
  fixedBottomItem = null,
  height,
  children = null,
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

  const getHeight = () => {
    if (height) return height;
    if (items?.length || fixedTopItem || fixedBottomItem)
      return (items?.length ? items?.length * 60 : 0) + (fixedTopItem || fixedBottomItem ? 60 : 0);
  };

  return (
    <div style={{ padding: '5px', marginTop: '15px' }}>
      <ToggleButtonsContainerHeader expanded={expanded} onClick={handleOnClick}>
        {title}
        <MdExpandMore />
      </ToggleButtonsContainerHeader>
      <ExpandSection height={getHeight()} expanded={String(expanded)} hide={String(hide)}>
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
      </ExpandSection>
    </div>
  );
};
export default SidebarExpandableSection;
