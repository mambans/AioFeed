import React, { useContext } from 'react';
import { MdDeleteForever } from 'react-icons/md';

import { ListActionButton } from './StyledComponents';
import MyListsContext from './MyListsContext';
import API from '../navigation/API';

const DeleteListBtn = ({ list, style, children }) => {
  const { setLists } = useContext(MyListsContext);
  const deleteList = async () => {
    const confirmed = window.confirm(`Delete list ${list.name}?`);
    if (!confirmed) return false;

    setLists((curr) => {
      const orginialList = { ...curr };
      const name = Object.keys(orginialList).find((key) => orginialList[key].name === list.name);
      delete orginialList[name];

      return orginialList;
    });

    API.deleteSavedList(list.name);
  };

  return (
    <ListActionButton onClick={deleteList} style={{ ...style, marginLeft: '-3px' }}>
      <MdDeleteForever size={24} />
      {children}
    </ListActionButton>
  );
};

export default DeleteListBtn;
