import React, { useRef } from 'react';
import ChannelSearchBarItem from '../searchbars/ChannelSearchBarItem';

const LoadingList = ({ amount, style = {} }) => {
  const array = useRef(
    Array.apply(null, Array(amount)).map((x, i) => ({
      id: i,
      width: `${Math.floor(Math.random() * 80)}%`,
    }))
  );

  return array.current.map((item, index) => (
    <ChannelSearchBarItem className={'loading'} key={index} style={{ ...style }}>
      {/* <div style={{ width: item.width }}></div> */}
    </ChannelSearchBarItem>
  ));
};
export default LoadingList;
