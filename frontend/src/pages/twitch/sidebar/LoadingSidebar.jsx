import React from 'react';
import {
  Styledsidebar,
  SidebarHeader,
  LoadingSidebarItems,
  StyledSidebarSection,
} from './StyledComponents';

const LoadingSidebar = () => {
  const array = Array.apply(null, Array(7)).map((x, i) => i);
  const channelWidth = Math.floor(Math.random() * (75 - 20)) + 20;
  const gameWidth = Math.floor(Math.random() * (100 - 20)) + 20;

  return (
    <Styledsidebar>
      <StyledSidebarSection>
        <SidebarHeader />
        {array.map((value) => (
          <LoadingSidebarItems
            key={value}
            channelWidth={`${channelWidth}%`}
            gameWidth={`${gameWidth}%`}
          >
            <div className='Profile' />
            <div className='Channel' />
            <div className='Game' />
          </LoadingSidebarItems>
        ))}
      </StyledSidebarSection>
    </Styledsidebar>
  );
};
export default LoadingSidebar;
