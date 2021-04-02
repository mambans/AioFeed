import { Link, useLocation } from 'react-router-dom';
import React, { useRef } from 'react';
import { MdRefresh } from 'react-icons/md';
import { FaRegWindowRestore } from 'react-icons/fa';
import CountdownCircleTimer from './CountdownCircleTimer';

import {
  HeaderOuterMainContainer,
  HeaderTopContainer,
  LeftRightDivs,
  RefreshButton,
  HeaderLines,
  HeaderTitle,
} from './sharedStyledComponents';
import ReOrderButtons from './ReOrderButtons';

export default (props) => {
  const {
    children,
    text,
    onHoverIconLink,
    id,
    leftImage,
    leftSide,
    rightSide,
    isLoading,
    autoRefreshEnabled,
    refreshFunc,
    refreshTimer,
    style = {},
    setOrder,
    feedName,
  } = props;
  const ref = useRef();
  const path = useLocation().pathname.replace('/', '');

  const handleOnClick = () => {
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  };

  return (
    <HeaderOuterMainContainer ref={ref} style={style} id={id}>
      <HeaderTopContainer>
        <LeftRightDivs>
          {refreshFunc && (
            <RefreshButton disabled={isLoading} onClick={refreshFunc}>
              {autoRefreshEnabled || isLoading ? (
                <CountdownCircleTimer
                  key={refreshTimer}
                  isLoading={isLoading}
                  autoRefreshEnabled={autoRefreshEnabled}
                  startDuration={Math.max(0, Math.round((refreshTimer - Date.now()) / 1000))}
                />
              ) : (
                <MdRefresh size={32} />
              )}
            </RefreshButton>
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
          {onHoverIconLink && onHoverIconLink !== path && (
            <Link
              to={`/${onHoverIconLink}`}
              className='openIndividualFeed'
              title={`Link to ${text.props.children[0].trim()} individual feed page.`}
            >
              <FaRegWindowRestore size={18} />
            </Link>
          )}
        </h5>
        <HeaderLines />
      </HeaderTitle>
    </HeaderOuterMainContainer>
  );
};
