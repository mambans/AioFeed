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

export const addFavoriteVideo = async ({ setLists, id, videoId }) => {
  if (typeof setLists === 'function')
    setLists((lists) => {
      if (lists && id && videoId) {
        const newVideo = parseNumberAndString(videoId);
        const allOrinalLists = { ...lists };
        const existing = allOrinalLists[id];

        const videos = [...new Set([...(existing?.videos || []), newVideo])].filter((i) => i);
        const newObj = {
          ...existing,
          videos,
        };

        allOrinalLists[id] = newObj;

        API.updateSavedList(id, { videos });

        return { ...allOrinalLists };
      }
    });
};

export const removeFavoriteVideo = async ({ setLists, id, videoId }) => {
  setLists((lists) => {
    const newItem = parseNumberAndString(videoId);
    const allOrinalLists = { ...lists };
    const existing = allOrinalLists[id];
    const videos = existing.videos.filter((item) => item !== newItem);
    const newObj = {
      ...existing,
      videos,
    };

    API.updateSavedList(id, { videos });

    return { ...allOrinalLists, [id]: newObj };
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
  const videoAdded = list && list?.videos?.includes(parseNumberAndString(videoId));
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

          removeFavoriteVideo({ setLists, id: list?.id, videoId });
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
          addFavoriteVideo({ setLists, id: list?.id, videoId });
          if (redirect && list?.title) {
            setListToShow(list);
            window.history.pushState(
              {},
              document.title,
              `${window.location.origin + window.location.pathname}?list=${list?.title}`
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

const AddToListModal = ({ openFunction, videoId, redirect }) => {
  const { lists, setLists } = useContext(MyListsContext) || {};

  return (
    <Lists onMouseEnter={openFunction}>
      <ListsLink>
        <Link to='/mylists'>Lists</Link>
      </ListsLink>
      {lists &&
        Object?.values(lists).map((list, index) => (
          <ListItem key={list.title + index}>
            {list.title}
            <AddRemoveBtn list={list} videoId={videoId} setLists={setLists} redirect={redirect} />
          </ListItem>
        ))}
      <NewListForm item={videoId} />
    </Lists>
  );
};

export default AddToListModal;
