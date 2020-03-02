import axios from "axios";

import Utilities from "../../utilities/Utilities";
import GetCachedProfiles from "./GetCachedProfiles";

const fetchAllOnlineStreams = async followedChannelsIds => {
  let LiveFollowedStreams;
  LiveFollowedStreams = await axios.get(`https://api.twitch.tv/helix/streams`, {
    params: {
      user_id: followedChannelsIds,
      first: 100,
    },
    headers: {
      Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
      "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
    },
  });

  return LiveFollowedStreams;
};

async function getFollowedOnlineStreams(followedchannels) {
  let error;

  try {
    // Make an array of all followed channels id's for easier/less API reuqests.
    const followedChannelsIds = await followedchannels.map(channel => {
      return channel.to_id;
    });

    // Get all Live-streams from followed channels.
    const LiveFollowedStreams = await fetchAllOnlineStreams(followedChannelsIds);

    try {
      await new Promise(async (resolve, reject) => {
        if (LiveFollowedStreams.data.data.length > 0) {
          const TwitchProfiles = GetCachedProfiles();

          const noCachedProfileArrayObject = await LiveFollowedStreams.data.data.filter(user => {
            return !Object.keys(TwitchProfiles).some(id => id === user.user_id);
          });

          const noCachedProfileArrayIds = Object.values(noCachedProfileArrayObject).map(user => {
            return user.user_id;
          });

          let newProfileImgUrls;

          if (noCachedProfileArrayIds.length > 0) {
            newProfileImgUrls = await axios
              .get(`https://api.twitch.tv/helix/users?`, {
                params: {
                  id: noCachedProfileArrayIds,
                },
                headers: {
                  Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
                  "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                },
              })
              .catch(e => {
                console.log("newProfileImgUrls: ", e);
              });
          }

          Promise.all(
            await LiveFollowedStreams.data.data.map(async user => {
              if (TwitchProfiles[user.user_id]) {
                user.profile_img_url = TwitchProfiles[user.user_id];
              } else {
                user.profile_img_url = newProfileImgUrls.data.data.find(p_user => {
                  return p_user.id === user.user_id;
                }).profile_image_url;
              }
              return user;
            })
          ).then(res => {
            const newProfiles = res.reduce(
              // eslint-disable-next-line no-sequences
              (obj, item) => ((obj[item.user_id] = item.profile_img_url), obj),
              {}
            );

            const FinallTwitchProfilesObj = { ...newProfiles, ...TwitchProfiles };

            localStorage.setItem("TwitchProfiles", JSON.stringify(FinallTwitchProfilesObj));
          });

          // Removes game id duplicates before sending game request.
          const games = [
            ...new Set(
              LiveFollowedStreams.data.data.map(channel => {
                return channel.game_id;
              })
            ),
          ];

          // Get game names from their Id's.
          const gameNames = await axios.get(`https://api.twitch.tv/helix/games`, {
            params: {
              id: games,
            },
            headers: {
              Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
              "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
            },
          });

          // Add the game name to each stream object.
          LiveFollowedStreams.data.data.map(stream => {
            gameNames.data.data.find(game => {
              return game.id === stream.game_id;
            }) !== undefined
              ? (stream.game_name = gameNames.data.data.find(game => {
                  return game.id === stream.game_id;
                }).name)
              : (stream.game_name = "");

            return undefined;
          });

          // Add the game img to each stream object.
          LiveFollowedStreams.data.data.map(stream => {
            gameNames.data.data.find(game => {
              return game.id === stream.game_id;
            }) !== undefined
              ? (stream.game_img = gameNames.data.data.find(game => {
                  return game.id === stream.game_id;
                }).box_art_url)
              : (stream.game_img = `${process.env.PUBLIC_URL}/images/placeholder.jpg`);

            return undefined;
          });

          resolve();
        } else {
          // error = "No followed streams online at the momment";
          // reject("No streams online at the momment");
          reject();
        }
      });
    } catch (e) {
      console.error(e);
      error = e;
      return { error: error, status: 201 };
    }
    return {
      data: LiveFollowedStreams.data.data,
      status: 200,
      error: error,
    };
  } catch (error) {
    console.error(error.message);
    return error;
  }
}

export default getFollowedOnlineStreams;
