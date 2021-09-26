import React, { useContext, useRef } from 'react';
import { MdArrowDownward } from 'react-icons/md';
import API from '../navigation/API';
import MyListsContext from './MyListsContext';
import { ListActionButton } from './StyledComponents';

const ReverseListButton = ({ list, style = {}, children }) => {
  const { setMyListPreferences, myListPreferences } = useContext(MyListsContext);
  const timer = useRef();

  const reverseList = () => {
    setMyListPreferences((pref = {}) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        API.softUpdateAccount(`MyListPreferences`, {
          [list.name]: { Reversed: !pref?.[list.name]?.Reversed },
        });
      }, 2500);

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