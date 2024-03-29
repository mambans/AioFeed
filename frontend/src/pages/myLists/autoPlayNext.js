import { parseNumberAndString } from './dragDropUtils';

const autoPlayNext = ({
  loopEnabled = false,
  listVideos,
  videoId,
  listToShow,
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

        if (nextVideoIndex >= listToShow?.videos?.length) {
          if (loopList) return listVideos?.[0];
          return false;
        }

        return listVideos?.[nextVideoIndex];
      } else if (loopList) {
        const nextVideoIndex = listVideos?.findIndex((v) => v.id === videoId) + 1;
        return listVideos?.[nextVideoIndex >= listToShow?.videos?.length ? 0 : nextVideoIndex];
      }

      return false;
    })();

    if (!nextVideo) return false;

    const videoType = typeof parseNumberAndString(nextVideo.id) === 'string' ? 'youtube' : 'videos';
    if (videoType === 'youtube') {
      return `/youtube/${nextVideo.id}?list=${listToShow.title}`;
    } else {
      return `/${nextVideo.user_login}/videos/${nextVideo.id}?list=${listToShow.title}`;
    }
  }
};

export default autoPlayNext;
