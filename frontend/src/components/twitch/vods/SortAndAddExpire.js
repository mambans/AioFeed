import { sortBy, reverse } from 'lodash';

export default (followedStreamVods, vodExpire, oldLoaded, oldExpire) => {
  const liveVods = followedStreamVods.filter((vod) => vod.thumbnail_url === '');
  const completedVods = followedStreamVods.filter((vod) => vod.thumbnail_url !== '');
  const sortedLiveVods = sortBy(
    liveVods,
    (stream) => Date.now() - new Date(stream.created_at).getTime()
  );
  const sortedCompletedVods = reverse(
    sortBy(completedVods, (stream) => new Date(stream.endDate).getTime())
  );

  const Vods = {
    data: sortedLiveVods.concat(sortedCompletedVods),
    expire: oldExpire || Date.now() + vodExpire * 60 * 60 * 1000,
    loaded: oldLoaded || Date.now(),
  };

  return Vods;
};
