import TwitchAPI from '../API';
import { getLocalstorage } from '../../../util';
// import fetchProfileImages from '../fetchProfileImages';
import addProfileInfo from '../functions/addProfileInfo';

/**
 * @param {String} channelId - Channel id of Twitch channel to fetch info from.
 * @param {Boolean} format - format data to match TwitchAPI.getStreams() output.
 */
const fetchChannelInfo = async (channelId, format) => {
  return await TwitchAPI.getChannel({ broadcaster_id: channelId })
    .then(async (res) => {
      if (res) {
        if (format) {
          const localstorageGameInfo =
            getLocalstorage('Twitch_game_details')?.[res.data?.data?.game_id] || null;

          const profileImage = await addProfileInfo({
            items: [res.data?.data?.[0]],
          }).then((r) => r?.[0] || {});

          const data = {
            ...res.data?.data?.[0],
            user_name: res.data?.data?.[0]?.broadcaster_name,
            title: res.data?.data?.[0]?.title,
            user_id: res.data?.data?.[0]?.broadcaster_id,
            game_name: res.data?.data?.[0]?.game_name,
            game: res.data?.data?.[0]?.game_name,
            started_at: Date.now() - 1000,
            viewers: 0,
            game_img: localstorageGameInfo && localstorageGameInfo.box_art_url,
            ...(profileImage?.[0] || {}),
          };
          return data;
        }
        return res.data;
      }
    })
    .catch((error) => console.error('fetchChannelInfo: ', error));
};
export default fetchChannelInfo;
