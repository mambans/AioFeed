import { sortBy, reverse } from "lodash";

export default (followedStreamVods, vodExpire, oldLoaded, oldExpire) => {
  const liveVods = followedStreamVods.filter(vod => {
    return vod.thumbnail_url === "";
  });
  const completedVods = followedStreamVods.filter(vod => {
    return vod.thumbnail_url !== "";
  });
  const asd1 = sortBy(
    liveVods,
    stream => new Date().getTime() - new Date(stream.created_at).getTime()
  );
  const asd2 = reverse(sortBy(completedVods, stream => new Date(stream.endDate).getTime()));

  const Vods = {
    data: asd1.concat(asd2),
    expire: oldExpire || new Date().setHours(new Date().getHours() + vodExpire),
    loaded: oldLoaded || new Date(),
  };

  return Vods;
};
