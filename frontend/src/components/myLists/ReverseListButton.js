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
        [list.name]: { ...pref?.[list.name], Reversed: !pref?.[list.name]?.Reversed },
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
          transform: myListPreferences[list?.name]?.Reversed ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        <MdArrowDownward size={24} />
      </div>
      {children}
    </ListActionButton>
  );
};

export default ReverseListButton;
