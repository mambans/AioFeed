import { Link, useLocation } from 'react-router-dom';
import React, { useRef } from 'react';
import { FaRegWindowRestore } from 'react-icons/fa';

import {
  HeaderOuterMainContainer,
  HeaderTopContainer,
  LeftRightDivs,
  RefreshButton,
  HeaderLines,
  HeaderTitle,
} from './sharedStyledComponents';
import ReOrderButtons from './ReOrderButtons';

const Header = React.forwardRef((props, ref) => {
  const {
    children,
    text,
    onHoverIconLink,
    id,
    leftImage,
    leftSide,
    rightSide,
    autoRefreshEnabled,
    refreshFunc,
    refreshTimer,
    style = {},
    isLoading,
    setOrder,
    feedName,
  } = props;
  const thisref = useRef();
  const path = useLocation().pathname.replace('/', '');

  const handleOnClick = () => {
    thisref.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  };

  const OnHoverOpenInNewTab =
    onHoverIconLink && onHoverIconLink !== path ? (
      <Link
        to={`/${onHoverIconLink}`}
        className='openIndividualFeed'
        title={`Link to ${text.props.children[0].trim()} individual feed page.`}
      >
        <FaRegWindowRestore size={18} />
      </Link>
    ) : null;

  return (
    <HeaderOuterMainContainer ref={thisref} style={style} id={id}>
      <HeaderTopContainer>
        <LeftRightDivs>
          {refreshFunc && (
            <RefreshButton
              ref={ref}
              onClick={refreshFunc}
              refreshTimer={refreshTimer}
              autoRefreshEnabled={autoRefreshEnabled}
              parentIsLoading={isLoading}
            />
          )}
          {leftSide}
        </LeftRightDivs>
        {children}
        <LeftRightDivs>
          {rightSide}
          <ReOrderButtons setOrder={setOrder} feedName={feedName} />
        </LeftRightDivs>
      </HeaderTopContainer>
      <HeaderTitle>
        <HeaderLines />
        <h5 onClick={handleOnClick}>
          {leftImage}
          {text}
          {OnHoverOpenInNewTab}
        </h5>
        <HeaderLines />
      </HeaderTitle>
    </HeaderOuterMainContainer>
  );
});

export default Header;
