import TwitchAPI from '../API';
import { getLocalstorage } from '../../../util';
import fetchProfileImages from './../fetchProfileImages';

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
            getLocalstorage('Twitch_game_details')?.data?.find(
              (game) => game.name?.toLowerCase() === res.data?.data?.game_name?.toLowerCase()
            ) || null;

          const profileImage = await fetchProfileImages({
            items: { data: [res.data?.data?.[0]] },
          }).then((r) => r?.[0] || {});

          const data = {
            ...res.data?.data?.[0],
            user_name: res.data?.data?.[0].broadcaster_name,
            title: res.data?.data?.[0].title,
            user_id: res.data?.data?.[0].broadcaster_id,
            game_name: res.data?.data?.[0].game_name,
            game: res.data?.data?.[0].game_name,
            started_at: Date.now() - 1000,
            viewers: 0,
            game_img: localstorageGameInfo && localstorageGameInfo.box_art_url,
            ...profileImage,
          };
          return data;
        }
        return res.data;
      }
    })
    .catch((error) => console.error('fetchChannelInfo: ', error));

  // return await TwitchAPI.krakenGetChannelInfo({ id: channelId })
  //   .then((res) => {
  //     console.log('krakenGetChannelInfo:', res);
  //     if (res) {
  //       if (format) {
  //         const localstorageGameInfo =
  //           getLocalstorage('Twitch_game_details')?.data?.find(
  //             (game) => game.name?.toLowerCase() === res.data?.game?.toLowerCase()
  //           ) || null;

  //         const data = {
  //           ...res.data,
  //           profile_image_url: res.data.logo,
  //           user_name: res.data.display_name,
  //           title: res.data.status,
  //           user_id: res.data._id,
  //           game_name: res.data.game,
  //           started_at: Date.now() - 1000,
  //           viewers: 0,
  //           game_img: localstorageGameInfo && localstorageGameInfo.box_art_url,
  //         };
  //         return data;
  //       }
  //       return res.data;
  //     }
  //   })
  //   .catch((error) => console.error('fetchChannelInfo: ', error));
};
export default fetchChannelInfo;
