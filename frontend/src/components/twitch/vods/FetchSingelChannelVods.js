import axios from "axios";

import Util from "./../../../util/Util";
import AddVideoExtraData from "./../AddVideoExtraData";
import SortAndAddExpire from "./SortAndAddExpire";

export default async (channelId, setVods) => {
  const vodExpire = 3; // Number of days

  const addVodEndTime = async (followedStreamVods) => {
    return followedStreamVods.map((stream) => {
      if (stream.type === "archive") {
        stream.endDate = Util.durationToDate(stream.duration, stream.created_at);
      } else {
        stream.endDate = new Date(stream.created_at);
      }
      return stream;
    });
  };

  const axiosConfig = {
    method: "get",
    url: `https://api.twitch.tv/helix/videos?`,
    params: {
      user_id: channelId,
      period: "month",
      first: 1,
      // type: "archive",
      type: "all",
    },
    headers: {
      Authorization: `Bearer ${Util.getCookie("Twitch-access_token")}`,
      "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
    },
  };

  await axios(axiosConfig).then(async (res) => {
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
