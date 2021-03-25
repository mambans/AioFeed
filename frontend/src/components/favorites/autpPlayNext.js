import { parseNumberAndString } from './dragDropUtils';

export default ({
  loopEnabled = false,
  listVideos,
  videoId,
  list,
  listName,
  autoPlayNextEnabled,
}) => {
  if (!loopEnabled && Boolean(listVideos?.length) && autoPlayNextEnabled) {
    const nextVideoIndex = listVideos?.findIndex((v) => v.id === videoId) + 1;
    const nextVideo = listVideos?.[nextVideoIndex > list.items.length ? 0 : nextVideoIndex];

    if (!nextVideo) return false;

    const videoType = typeof parseNumberAndString(nextVideo.id) === 'string' ? 'youtube' : 'videos';
    if (videoType === 'youtube') {
      return `/youtube/${nextVideo.id}?list=${listName}`;
    } else {
      return `/${nextVideo.user_login}/videos/${nextVideo.id}?list=${listName}`;
    }
  }
};
