import React from 'react';
import { Styledsidebar, SidebarHeader, LoadingSidebarItems } from './StyledComponents';

const LoadingSidebar = () => {
  const array = Array.apply(null, Array(7)).map((x, i) => i);

  return (
    <Styledsidebar>
      <SidebarHeader />
      {array.map((value) => (
        <LoadingSidebarItems
          key={value}
          channelWidth={`${Math.floor(Math.random() * (75 - 20)) + 20}%`}
          gameWidth={`${Math.floor(Math.random() * (100 - 20)) + 20}%`}
        >
          <div className='Profile' />
          <div className='Channel' />
          <div className='Game' />
        </LoadingSidebarItems>
      ))}
    </Styledsidebar>
  );
};
export default LoadingSidebar;
