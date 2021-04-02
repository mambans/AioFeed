import axios from 'axios';
import { debounce } from 'lodash';

import { getCookie } from '../../util/Utils';

export const parseNumberAndString = (value) => {
  if (typeof value === 'number') return value;
  const parsedToInt = parseInt(value);
  const parsedToString = String(parseInt(value));
  if (parsedToInt && parsedToString.length === value.length) return parsedToInt;
  return value;
};

export const uploadNewList = debounce(
  async (e, listName, newList, setLists) => {
    e.preventDefault();
    const newListItems = newList.map((item) => {
      const id = item.id || item.contentDetails?.upload?.videoId;
      const videoId = parseNumberAndString(id) || id;

      return videoId;
    });

    const newListObj = { name: listName, items: newListItems };

    setLists((curr) => ({ ...curr, [listName]: newListObj }));

    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/savedlists`, {
        username: getCookie(`AioFeed_AccountName`),
        videosObj: newListObj,
        listName: listName,
        authkey: getCookie(`AioFeed_AuthKey`),
      })
      .catch((e) => console.error(e));
  },
  5000,
  { leading: false, trailing: true }
);

const findOutmostContainer = (target, count) => {
  if (target?.dataset?.id) return target;
  if (count > 15) return target;

  return findOutmostContainer(target?.offsetParent, count++);
};

export const restructureVideoList = debounce(
  (e, arr, dragSelected, setVideos) => {
    e.preventDefault();
    const videoElement = findOutmostContainer(e.target, 0);
    const videoId = videoElement?.dataset?.id;

    if (videoId && videoElement !== dragSelected?.element) {
      const array = [...arr];
      const newArray = array.filter(
        (video) =>
          (video.id || video.contentDetails?.upload?.videoId) !==
          (dragSelected.data.id || dragSelected.data.contentDetails?.upload?.videoId)
      );

      const new_index = array.findIndex(
        (video) => (video.id || video.contentDetails?.upload?.videoId) === videoId
      );
      newArray.splice(new_index, 0, dragSelected.data);

      setVideos(newArray);
    }
  },
  20,
  { leading: false, trailing: true }
);
