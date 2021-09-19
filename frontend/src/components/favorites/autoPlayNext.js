import { parseNumberAndString } from './dragDropUtils';

const autoPlayNext = ({
  loopEnabled = false,
  listVideos,
  videoId,
  list,
  listName,
  autoPlayNext,
  loopList,
  autoPlayRandom,
  playQueue,
  setPlayQueue,
}) => {
  if (!loopEnabled && Boolean(listVideos?.length)) {
    const nextVideo = (() => {
      if (playQueue?.length) {
        const nextVideo = { id: playQueue.shift() };
        setPlayQueue(playQueue);
        return nextVideo;
      } else if (autoPlayRandom) {
        const randomIndex = Math.floor(Math.random() * (listVideos?.length - 1));
        return listVideos[randomIndex];
      } else if (autoPlayNext) {
        const nextVideoIndex = listVideos?.findIndex((v) => v.id === videoId) + 1;

        if (nextVideoIndex >= list?.items?.length) {
          if (loopList) return listVideos?.[0];
          return false;
        }

        return listVideos?.[nextVideoIndex];
      } else if (loopList) {
        const nextVideoIndex = listVideos?.findIndex((v) => v.id === videoId) + 1;
        return listVideos?.[nextVideoIndex >= list?.items?.length ? 0 : nextVideoIndex];
      }

      return false;
    })();

    if (!nextVideo) return false;

    const videoType = typeof parseNumberAndString(nextVideo.id) === 'string' ? 'youtube' : 'videos';
    if (videoType === 'youtube') {
      return `/youtube/${nextVideo.id}?list=${listName}`;
    } else {
      return `/${nextVideo.user_login}/videos/${nextVideo.id}?list=${listName}`;
    }
  }
};

export default autoPlayNext;
