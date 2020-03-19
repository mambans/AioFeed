import axios from "axios";
import _ from "lodash";

import Util from "./../../../util/Util";
import AddVideoExtraData from "./../AddVideoExtraData";

export default async (channelId, setVods) => {
  const vodExpire = 3; // Number of days

  const addVodEndTime = async followedStreamVods => {
    return followedStreamVods.map(stream => {
      if (stream.type === "archive") {
        stream.endDate = Util.durationToDate(stream.duration, stream.published_at);
      } else {
        stream.endDate = new Date(stream.published_at);
      }
      return stream;
    });
  };

  const SortAndAddExpire = (followedStreamVods, vodExpire, loaded) => {
    let followedOrderedStreamVods = {};
    followedOrderedStreamVods.data = _.reverse(
      _.sortBy(followedStreamVods, stream => new Date(stream.endDate).getTime())
    );
    followedOrderedStreamVods.expire = new Date().setHours(new Date().getHours() + vodExpire);
    // followedOrderedStreamVods.loaded = new Date();
    followedOrderedStreamVods.loaded = loaded;

    return followedOrderedStreamVods;
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

  await axios(axiosConfig).then(async res => {
    const newVodWithProfile = await AddVideoExtraData(res);
    const newVodWithEndtime = await addVodEndTime(newVodWithProfile.data);

    setVods(vods => {
      const existingVods = [...vods.data];

      existingVods.push(newVodWithEndtime[0]);

      const FinallVods = SortAndAddExpire(existingVods, vodExpire, vods.loaded);

      localStorage.setItem(`Twitch-vods`, JSON.stringify(FinallVods));

      return FinallVods;
    });
  });
};
