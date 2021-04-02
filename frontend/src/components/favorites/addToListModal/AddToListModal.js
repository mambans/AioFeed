import React, { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import FavoritesContext from './../FavoritesContext';
import { getCookie } from '../../../util/Utils';
import {
  Lists,
  ListItem,
  ListsLink,
  AddItemBtn,
  RemoveItemBtn,
  IconContainer,
} from './../StyledComponents';
import useClicksOutside from '../../../hooks/useClicksOutside';
import { parseNumberAndString } from './../dragDropUtils';
import NewListForm from './NewListForm';
import { MdAddCircle, MdRemoveCircle } from 'react-icons/md';

export const addFavoriteVideo = async (lists, setLists, list_Name, newItem) => {
  if (lists && setLists && list_Name && newItem) {
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
  }
};

export const removeFavoriteVideo = async (lists, setLists, list_Name, newItem_p) => {
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

export const AddRemoveBtn = ({
  list,
  videoId,
  lists,
  setLists,
  size = 18,
  style,
  onMouseEnter,
  onMouseLeave,
}) => {
  // const { lists, setLists } = useContext(FavoritesContext);
  const videoAdded = list && list?.items?.includes(parseNumberAndString(videoId));

  if (videoAdded)
    return (
      <IconContainer
        onClick={() => removeFavoriteVideo(lists, setLists, list?.name, videoId)}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <RemoveItemBtn size={size} />
        <MdRemoveCircle
          className='actionIcon'
          color='red'
          size={size * 0.5}
          style={{ left: `${size}px` }}
        />
      </IconContainer>
    );

  return (
    <IconContainer
      onClick={() => addFavoriteVideo(lists, setLists, list?.name, videoId)}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <AddItemBtn size={size} />
      {list && (
        <MdAddCircle
          className='actionIcon'
          color='green'
          size={size * 0.5}
          style={{ left: `${size}px` }}
        />
      )}
    </IconContainer>
  );
};

export default ({ OpenFunction, CloseFunction, videoId }) => {
  const { lists, setLists } = useContext(FavoritesContext) || {};
  const listRef = useRef();

  useClicksOutside(listRef, CloseFunction);

  return (
    <Lists onMouseEnter={OpenFunction} ref={listRef}>
      <ListsLink>
        <Link to='/saved'>Lists</Link>
      </ListsLink>
      {lists &&
        Object?.values(lists).map((list) => (
          <ListItem key={list.name}>
            {list.name}
            <AddRemoveBtn list={list} videoId={videoId} setLists={setLists} lists={lists} />
          </ListItem>
        ))}
      <NewListForm item={videoId} />
    </Lists>
  );
};
