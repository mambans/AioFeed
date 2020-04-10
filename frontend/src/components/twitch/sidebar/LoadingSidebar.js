import React from "react";
import { Styledsidebar, SidebarHeader, LoadingSidebarItems } from "./StyledComponents";

export default () => {
  const array = Array.apply(null, Array(7)).map(function (x, i) {
    return i;
  });

  return (
    <Styledsidebar>
      <SidebarHeader />
      {array.map((value) => {
        return (
          <LoadingSidebarItems
            key={value}
            channelWidth={`${Math.floor(Math.random() * (75 - 20)) + 20}%`}
            gameWidth={`${Math.floor(Math.random() * (100 - 20)) + 20}%`}>
            <div className='Profile' />
            <div className='Channel' />
            <div className='Game' />
          </LoadingSidebarItems>
        );
      })}
    </Styledsidebar>
  );
};
