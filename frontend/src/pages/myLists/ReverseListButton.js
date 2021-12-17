import React, { useContext, useRef } from 'react';
import { MdArrowDownward } from 'react-icons/md';
import MyListsContext from './MyListsContext';
import { ListActionButton } from './StyledComponents';

const ReverseListButton = ({ list, style = {}, children }) => {
  const { setMyListPreferences, myListPreferences } = useContext(MyListsContext);
  const timer = useRef();

  const reverseList = () => {
    setMyListPreferences((pref = {}) => {
      clearTimeout(timer.current);
      return {
        ...pref,
        [list.title]: { ...pref?.[list.title], Reversed: !pref?.[list.title]?.Reversed },
      };
    });
  };

  return (
    <ListActionButton
      onClick={reverseList}
      style={{
        ...style,
        marginLeft: '-3px',
      }}
    >
      <div
        style={{
          transform: myListPreferences[list?.title]?.Reversed ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        <MdArrowDownward size={24} />
      </div>
      {children}
    </ListActionButton>
  );
};

export default ReverseListButton;
