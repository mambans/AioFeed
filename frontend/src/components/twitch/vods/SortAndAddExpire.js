import { sortBy, reverse } from "lodash";

export default (followedStreamVods, vodExpire, oldLoaded, oldExpire) => {
  const liveVods = followedStreamVods.filter(vod => {
    return vod.thumbnail_url === "";
  });

  const completedVods = followedStreamVods.filter(vod => {
    return vod.thumbnail_url !== "";
  });
  const sortedLiveVods = sortBy(
    liveVods,
    stream => new Date().getTime() - new Date(stream.created_at).getTime()
  );
  const sortedCompletedVods = reverse(
    sortBy(completedVods, stream => new Date(stream.endDate).getTime())
  );

  const Vods = {
    data: sortedLiveVods.concat(sortedCompletedVods),
    expire: oldExpire || new Date().setHours(new Date().getHours() + vodExpire),
    loaded: oldLoaded || new Date(),
  };

  return Vods;
};
