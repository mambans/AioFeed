import React, { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import FavoritesContext from './../FavoritesContext';
import { getCookie } from '../../../util/Utils';
import { Lists, ListItem, ListsLink, AddItemBtn, RemoveItemBtn } from './../StyledComponents';
import useClicksOutside from '../../../hooks/useClicksOutside';
import NewListForm from './NewListForm';

export const parseNumberAndString = (value) => {
  if (typeof value === 'number') return value;
  const parsedToInt = parseInt(value);
  const parsedToString = String(parseInt(value));
  if (parsedToInt && parsedToString.length === value.length) return parsedToInt;
  return value;
};

const AddRemoveBtn = ({ list, videoId }) => {
  const { lists, setLists } = useContext(FavoritesContext);
  const videoAdded = list.items.includes(parseNumberAndString(videoId));

  const addFunc = async (list_Name, newItem) => {
    const newVideo = parseNumberAndString(newItem);
    const allOrinalLists = { ...lists };
    const existing = allOrinalLists[list_Name];

    const newObj = {
      ...existing,
      items: [...new Set([...(existing?.items || []), newVideo])].filter((i) => i),
    };

    allOrinalLists[list_Name] = newObj;

    setLists({ ...allOrinalLists });

    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/savedlists`, {
        username: getCookie(`AioFeed_AccountName`),
        videosObj: newObj,
        listName: list_Name,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => console.error(e));
  };

  const removeFunc = async (list_Name, newItem_p) => {
    const newItem = parseNumberAndString(newItem_p);
    const allOrinalLists = { ...lists };
    const existing = allOrinalLists[list_Name];
    const newObj = {
      name: existing.name,
      items: existing.items.filter((item) => item !== newItem),
    };

    allOrinalLists[list_Name] = newObj;

    setLists({ ...allOrinalLists });

    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/savedlists`, {
        username: getCookie(`AioFeed_AccountName`),
        videosObj: newObj,
        listName: list_Name,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => console.error(e));
  };

  if (videoAdded) return <RemoveItemBtn size={18} onClick={() => removeFunc(list.name, videoId)} />;
  return <AddItemBtn size={18} onClick={() => addFunc(list.name, videoId)} />;
};

export default ({ OpenFunction, CloseFunctionDelay, CloseFunction, videoId }) => {
  const { lists, setLists } = useContext(FavoritesContext);
  const listRef = useRef();

  useClicksOutside(listRef, CloseFunction);

  return (
    <Lists onMouseEnter={OpenFunction} onMouseLeave={CloseFunctionDelay} ref={listRef}>
      <ListsLink>
        <Link to='/saved'>Lists</Link>
      </ListsLink>
      {Object?.values(lists).map((list) => (
        <ListItem>
          {list.name}
          <AddRemoveBtn list={list} videoId={videoId} />
        </ListItem>
      ))}
      <NewListForm lists={lists} setLists={setLists} item={videoId} />
    </Lists>
  );
};
