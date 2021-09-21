import React, { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';

import FavoritesContext from './../FavoritesContext';
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
import API from '../../navigation/API';

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

    API.updateSavedList(list_Name, newObj);

    const items = { ...allOrinalLists };
    setLists(items);

    return items[list_Name];
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

  API.updateSavedList(list_Name, newObj);
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
  redirect,
  setListName = () => {},
}) => {
  // const { lists, setLists } = useContext(FavoritesContext);
  const videoAdded = list && list?.items?.includes(parseNumberAndString(videoId));
  // const navigate = useNavigate();

  if (videoAdded)
    return (
      <IconContainer
        onClick={() => {
          removeFavoriteVideo(lists, setLists, list?.name, videoId);
          window.history.pushState(
            {},
            document.title,
            `${window.location.origin + window.location.pathname}`
          );
        }}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <RemoveItemBtn size={size} />
      </IconContainer>
    );

  return (
    <IconContainer
      onClick={() => {
        addFavoriteVideo(lists, setLists, list?.name, videoId);
        if (redirect && list?.name) {
          setListName(`${list?.name}`);
          window.history.pushState(
            {},
            document.title,
            `${window.location.origin + window.location.pathname}?list=${list?.name}`
          );
        }
      }}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <AddItemBtn size={size} />
    </IconContainer>
  );
};

const AddToListModal = ({ OpenFunction, CloseFunction, videoId, redirect, setListName }) => {
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
            <AddRemoveBtn
              list={list}
              videoId={videoId}
              setLists={setLists}
              lists={lists}
              redirect={redirect}
              setListName={setListName}
            />
          </ListItem>
        ))}
      <NewListForm item={videoId} />
    </Lists>
  );
};

export default AddToListModal;
