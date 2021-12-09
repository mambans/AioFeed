import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import useSyncedLocalState from '../../hooks/useSyncedLocalState';
import API from '../navigation/API';
import AccountContext from '../account/AccountContext';
import LogsContext from '../logs/LogsContext';
import { parseNumberAndString } from './dragDropUtils';

const MyListsContext = React.createContext();

export const MyListsProvider = ({ children }) => {
  const { authKey } = useContext(AccountContext);
  const { addLog } = useContext(LogsContext);
  const [lists, setLists] = useSyncedLocalState('Mylists', {}) || {};
  const [myListPreferences, setMyListPreferences] =
    useSyncedLocalState('MylistsPreferences', {}) || {};
  const [isLoading, setIsLoading] = useState();
  const invoked = useRef(false);

  const addList = async (title, item) => {
    const newVideo = item ? (Array.isArray(item) ? item : [parseNumberAndString(item)]) : [];
    const id = Date.now();
    const videos = newVideo.filter((i) => i);
    const newListObj = {
      title,
      id,
      videos,
      enabled: true,
    };

    setLists((curr) => ({ ...curr, [id]: newListObj }));

    setTimeout(() => {
      const list = document.getElementById(title);
      list?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }, 0);

    API.createSavedList(id, newListObj);
  };

  const deleteList = async ({ id }) => {
    const title = lists[id]?.title;
    const confirmed = window.confirm(`Delete list ${title}?`);
    if (!confirmed) return false;

    setLists((curr) => {
      const orginialList = { ...curr };
      delete orginialList[id];

      return orginialList;
    });

    await API.deleteSavedList(id);
    addLog({
      title: `${title} list deleted`,
      text: `${title} list deleted`,
      icon: 'mylist',
    });
  };

  const editListName = async ({ id, title }) => {
    setLists((curr) => {
      const orginialList = { ...curr };
      const list = orginialList[id];
      const newList = { [id]: { ...list, title } };
      return { ...orginialList, ...newList };
    });
    API.updateSavedList(id, { title });
  };

  const toggleList = async (id) => {
    setLists((c) => {
      const enabled = !c[id].enabled;
      const obj = {
        ...c[id],
        enabled,
      };
      const newList = {
        [id]: obj,
      };
      API.updateSavedList(id, { enabled });
      return {
        ...c,
        ...newList,
      };
    });
  };

  const orderedList = useMemo(() => {
    return Object.values(lists).reduce((lists, list) => {
      return {
        ...lists,
        [list.title]: {
          ...list,
          videos: myListPreferences?.[list.title]?.Reversed
            ? [...list?.videos]?.reverse()
            : list.videos,
        },
      };
    }, {});
  }, [lists, myListPreferences]);

  const fetchMyListContextData = useCallback(async () => {
    setIsLoading(true);
    const { Items } = (await API.getSavedList()) || {};
    const lists = Items?.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]: curr,
      };
    }, {});

    if (lists) setLists(lists);
  }, [setLists]);

  const checkIfListNameIsAvaliable = useCallback(
    (name) => {
      return (
        !name ||
        !lists ||
        lists.length ||
        (name &&
          !Object.values(lists).find((list) => list.title.toLowerCase() === name.toLowerCase()))
      );
    },
    [lists]
  );

  useEffect(() => {
    if (authKey && !invoked.current) fetchMyListContextData();
  }, [fetchMyListContextData, authKey]);

  return (
    <MyListsContext.Provider
      value={{
        lists: orderedList,
        setLists,
        fetchMyListContextData,
        isLoading,
        setIsLoading,
        myListPreferences,
        setMyListPreferences,
        addList,
        toggleList,
        deleteList,
        editListName,
        checkIfListNameIsAvaliable,
      }}
    >
      {children}
    </MyListsContext.Provider>
  );
};

export default MyListsContext;
