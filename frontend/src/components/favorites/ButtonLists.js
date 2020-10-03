import React, { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import FavoritesContext from './FavoritesContext';
import { getCookie } from '../../util/Utils';
import { Lists, ListItem, ListsLink, AddItemBtn, RemoveItemBtn } from './StyledComponents';
import useClicksOutside from '../../hooks/useClicksOutside';
import NewListForm from './NewListForm';

export default ({ OpenFunction, CloseFunctionDelay, CloseFunction, videoId }) => {
  const { lists, setLists } = useContext(FavoritesContext);
  const listRef = useRef();

  useClicksOutside(listRef, CloseFunction);

  const checkIfInList = (listItems, value) => listItems.includes(value);

  const addFunc = async (list_Name, newItem) => {
    const allOrinalLists = { ...lists };

    const existing = allOrinalLists[list_Name];
    const newObj = {
      ...existing,
      items: [...new Set([...(existing?.items || []), newItem])].filter((i) => i),
    };

    allOrinalLists[list_Name] = newObj;

    setLists(allOrinalLists);

    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/savedlists`, {
        username: getCookie(`AioFeed_AccountName`),
        videosObj: newObj,
        listName: list_Name,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .then((res) => {
        return res;
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const removeFunc = async (list_Name, newItem_p) => {
    const newItem = typeof newItem_p === 'number' ? parseInt(newItem_p) || newItem_p : newItem_p;

    const allOrinalLists = { ...lists };

    const existing = allOrinalLists[list_Name];

    const newObj = {
      name: existing.name,
      items: existing.items.filter((item) => item !== newItem),
    };
    console.log('removeFunc -> newObj', newObj);

    allOrinalLists[list_Name] = newObj;

    setLists(allOrinalLists);

    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/savedlists`, {
        username: getCookie(`AioFeed_AccountName`),
        videosObj: newObj,
        listName: list_Name,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .then((res) => {
        return res;
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <Lists onMouseEnter={OpenFunction} onMouseLeave={CloseFunctionDelay} ref={listRef}>
      <ListsLink>
        <Link to='/saved'>Lists</Link>
      </ListsLink>
      {Object.values(lists).map((list) => {
        return (
          <ListItem>
            {list.name}
            {!checkIfInList(list.items, videoId) ? (
              <AddItemBtn size={16} onClick={() => addFunc(list.name, videoId)} />
            ) : (
              <RemoveItemBtn size={16} onClick={() => removeFunc(list.name, videoId)} />
            )}
          </ListItem>
        );
      })}
      <NewListForm lists={lists} setLists={setLists} item={videoId} />
    </Lists>
  );
};
