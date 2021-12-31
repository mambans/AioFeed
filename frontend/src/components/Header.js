import React from 'react';

import {
  HeaderOuterMainContainer,
  HeaderTopContainer,
  LeftRightDivs,
  HeaderLines,
  HeaderTitle,
  HeaderNumberCountContainer,
} from './styledComponents';

import RefreshButton from './RefreshButton';

export const HeaderNumberCount = ({ text, showZero }) => {
  if ((!text || parseInt(text) <= 0) && !showZero) return null;

  return <HeaderNumberCountContainer>{text}</HeaderNumberCountContainer>;
};

const Header = React.forwardRef((props, ref) => {
  const {
    children,
    id,
    leftSide,
    rightSide,
    autoRefreshEnabled,
    refreshFunc,
    refreshTimer,
    style = {},
    isLoading,
    title,
  } = props;

  return (
    <HeaderOuterMainContainer style={style} id={id}>
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
        <LeftRightDivs>{rightSide}</LeftRightDivs>
      </HeaderTopContainer>
      <HeaderTitle>
        <HeaderLines />
        {title}
        <HeaderLines />
      </HeaderTitle>
    </HeaderOuterMainContainer>
  );
});

export default Header;
