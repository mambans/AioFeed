import { debounce } from 'lodash';

import API from '../navigation/API';

export const parseNumberAndString = (value) => {
  if (typeof value === 'number') return value;
  const parsedToInt = parseInt(value);
  const parsedToString = String(parseInt(value));
  if (parsedToInt && parsedToString.length === value.length) return parsedToInt;
  return value;
};

export const uploadNewList = debounce(
  async (e, id, newList, setLists) => {
    e.preventDefault();
    const newListItems = newList.map((item) => {
      const id = item.id || item.contentDetails?.upload?.videoId;
      const videoId = parseNumberAndString(id) || id;

      return videoId;
    });

    setLists((curr) => ({ ...curr, [id]: { ...curr[id], videos: newListItems } }));

    API.updateSavedList(id, { videos: newListItems });
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
  (e, dragSelected, setVideos) => {
    e.preventDefault();
    // e.dataTransfer.dropEffect = 'all';
    const videoElement = findOutmostContainer(e.target, 0);
    const videoId = videoElement?.dataset?.id;

    if (videoId && videoElement !== dragSelected?.element) {
      setVideos((c) => {
        const array = [...c];
        const newArray = array.filter(
          (video) =>
            (video.id || video.contentDetails?.upload?.videoId) !==
            (dragSelected?.data.id || dragSelected?.data.contentDetails?.upload?.videoId)
        );

        const new_index = array.findIndex(
          (video) => (video.id || video.contentDetails?.upload?.videoId) === videoId
        );

        newArray.splice(new_index, 0, dragSelected?.data);

        return newArray;
      });
    }
  },
  20,
  { leading: false, trailing: true }
);
