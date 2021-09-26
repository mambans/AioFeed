import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import MyListsContext from './../MyListsContext';
import {
  Lists,
  ListItem,
  ListsLink,
  AddItemBtn,
  RemoveItemBtn,
  AddedItemBtn,
  IconContainer,
} from './../StyledComponents';
import { parseNumberAndString } from './../dragDropUtils';
import NewListForm from './NewListForm';
import API from '../../navigation/API';

export const addFavoriteVideo = async (setLists, list_Name, newItem) => {
  if (typeof setLists === 'function')
    setLists((lists) => {
      if (lists && list_Name && newItem) {
        const newVideo = parseNumberAndString(newItem);
        const allOrinalLists = { ...lists };
        const existing = allOrinalLists[list_Name];

        const newObj = {
          ...existing,
          items: [...new Set([...(existing?.items || []), newVideo])].filter((i) => i),
        };

        allOrinalLists[list_Name] = newObj;

        API.updateSavedList(list_Name, newObj);

        return { ...allOrinalLists };
      }
    });
};

export const removeFavoriteVideo = async (setLists, list_Name, newItem_p) => {
  setLists((lists) => {
    const newItem = parseNumberAndString(newItem_p);
    const allOrinalLists = { ...lists };
    const existing = allOrinalLists[list_Name];
    const newObj = {
      name: existing.name,
      items: existing.items.filter((item) => item !== newItem),
    };

    allOrinalLists[list_Name] = newObj;
    API.updateSavedList(list_Name, newObj);

    return { ...allOrinalLists };
  });
};

export const AddRemoveBtn = ({
  list,
  videoId,
  setLists,
  size = 18,
  style,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  redirect,
  setListToShow = () => {},
  onClick,
}) => {
  const videoAdded = list && list?.items?.includes(parseNumberAndString(videoId));
  const [isHovered, setIsHovered] = useState();

  const mouseEnter = (e) => {
    onMouseEnter(e);
    setIsHovered(true);
  };
  const mouseLeave = (e) => {
    onMouseLeave(e);
    setIsHovered(null);
  };

  if (videoAdded)
    return (
      <IconContainer
        onClick={(e) => {
          if (onClick) {
            onClick(e);
            return;
          }

          removeFavoriteVideo(setLists, list?.name, videoId);
          window.history.pushState(
            {},
            document.title,
            `${window.location.origin + window.location.pathname}`
          );
        }}
        style={style}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
      >
        {isHovered ? <RemoveItemBtn size={size} /> : <AddedItemBtn size={size} />}
      </IconContainer>
    );

  return (
    <IconContainer
      onClick={(e) => {
        if (onClick) {
          onClick(e);
          return;
        }

        if (list) {
          addFavoriteVideo(setLists, list?.name, videoId);
          if (redirect && list?.name) {
            setListToShow(list);
            window.history.pushState(
              {},
              document.title,
              `${window.location.origin + window.location.pathname}?list=${list?.name}`
            );
          }
        }
      }}
      style={style}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
    >
      <AddItemBtn size={size} disablehovereffect={String(!list)} />
    </IconContainer>
  );
};

const AddToListModal = ({ OpenFunction, videoId, redirect }) => {
  const { lists, setLists } = useContext(MyListsContext) || {};

  return (
    <Lists onMouseEnter={OpenFunction}>
      <ListsLink>
        <Link to='/mylists'>Lists</Link>
      </ListsLink>
      {lists &&
        Object?.values(lists).map((list, index) => (
          <ListItem key={list.name + index}>
            {list.name}
            <AddRemoveBtn list={list} videoId={videoId} setLists={setLists} redirect={redirect} />
          </ListItem>
        ))}
      <NewListForm item={videoId} />
    </Lists>
  );
};

export default AddToListModal;
