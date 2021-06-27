import React, { useContext } from 'react';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';

import { getCookie } from '../../util/Utils';
import { ListActionButton } from './StyledComponents';
import FavoritesContext from './FavoritesContext';

const DeleteListBtn = ({ list, style, children }) => {
  const { setLists } = useContext(FavoritesContext);
  const deleteList = async () => {
    const confirmed = window.confirm(`Delete list ${list.name}?`);
    if (!confirmed) return false;

    setLists((curr) => {
      const orginialList = { ...curr };
      const name = Object.keys(orginialList).find((key) => orginialList[key].name === list.name);
      delete orginialList[name];

      return orginialList;
    });

    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/savedlists/delete`, {
        username: getCookie('AioFeed_AccountName'),
        listName: list.name,
      })
      .catch((e) => console.error(e));
  };

  return (
    <ListActionButton onClick={deleteList} style={{ ...style, marginLeft: '-3px' }}>
      <MdDeleteForever size={24} />
      {children}
    </ListActionButton>
  );
};

export default DeleteListBtn;
