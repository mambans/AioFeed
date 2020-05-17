import { durationToDate } from "./../TwitchUtils";
import AddVideoExtraData from "./../AddVideoExtraData";
import SortAndAddExpire from "./SortAndAddExpire";
import API from "../API";

export default async (channelId, setVods) => {
  const vodExpire = 3; // Number of days

  const addVodEndTime = async (followedStreamVods) => {
    return followedStreamVods.map((stream) => {
      if (stream.type === "archive") {
        stream.endDate = durationToDate(stream.duration, stream.created_at);
      } else {
        stream.endDate = new Date(stream.created_at).getTime();
      }
      return stream;
    });
  };

  await API.getVideos({
    params: {
      user_id: channelId,
      period: "month",
      first: 1,
      // type: "archive",
      type: "all",
    },
  }).then(async (res) => {
    const newVodWithProfile = await AddVideoExtraData(res);
    const newVodWithEndtime = await addVodEndTime(newVodWithProfile.data);

    setVods((vods) => {
      const existingVods = [...vods.data];
      const vodToAdd = { ...newVodWithEndtime[0], transition: "videoFadeSlide" };
      const objectToUpdateIndex = existingVods.findIndex((item) => {
        return item.id === vodToAdd.id;
      });

      existingVods.splice(objectToUpdateIndex, 1);
      existingVods.push(vodToAdd);

      const FinallVods = SortAndAddExpire(existingVods, vodExpire, vods.loaded, vods.expire);
      localStorage.setItem(`Vods`, JSON.stringify(FinallVods));

      return FinallVods;
    });
  });
};
