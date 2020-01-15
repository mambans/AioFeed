import axios from "axios";

import Utilities from "./../../../utilities/Utilities";

export default async (game_param_url, pagination) => {
  let game;
  let error;
  const nrStreams =
    Math.floor((document.documentElement.clientWidth - 150) / 350) *
    Math.floor((document.documentElement.clientHeight - (65 + 60)) / 351);

  if (game_param_url && game_param_url !== "undefined") {
    game = await axios
      .get(`https://api.twitch.tv/helix/games`, {
        params: {
          name: game_param_url,
        },
        headers: {
          Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .then(res => {
        return res.data.data[0];
      });
  } else {
    game = { id: null };
  }

  const topStreams = await axios
    .get(`https://api.twitch.tv/helix/streams`, {
      params: {
        first: nrStreams,
        game_id: game.id,
        after: pagination ? pagination : null,
      },
      headers: {
        Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
      },
    })
    .catch(e => {
      console.error(e.message);
      error = e;
      return e;
    });

  try {
    const ChachedAndExpire = () => {
      const profiles = JSON.parse(localStorage.getItem("TwitchProfiles")) || {};

      if (!profiles.expireDate || new Date(profiles.expireDate).getTime() < new Date().getTime()) {
        return {
          expireDate: new Date(new Date().setTime(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)),
        };
      } else {
        return profiles;
      }
    };

    const TwitchProfiles = ChachedAndExpire();

    // const TwitchProfiles = JSON.parse(localStorage.getItem("TwitchProfiles")) || {};

    await Promise.all(
      topStreams.data.data.map(async user => {
        if (!TwitchProfiles[user.user_id]) {
          const profileImgUrl = await axios.get(`https://api.twitch.tv/helix/users?`, {
            params: {
              id: user.user_id,
            },
            headers: {
              Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
              "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
            },
          });

          user.profile_img_url = profileImgUrl.data.data[0].profile_image_url;
          TwitchProfiles[user.user_id] = profileImgUrl.data.data[0].profile_image_url;
        } else {
          user.profile_img_url = TwitchProfiles[user.user_id];
        }
      })
    );

    localStorage.setItem("TwitchProfiles", JSON.stringify(TwitchProfiles));

    // Removes game id duplicates before sending game request.
    const games = [
      ...new Set(
        topStreams.data.data.map(channel => {
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
    topStreams.data.data.map(stream => {
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
    topStreams.data.data.map(stream => {
      gameNames.data.data.find(game => {
        return game.id === stream.game_id;
      }) !== undefined
        ? (stream.game_img = gameNames.data.data.find(game => {
            return game.id === stream.game_id;
          }).box_art_url)
        : (stream.game_img = `${process.env.PUBLIC_URL}/images/placeholder.jpg`);

      return undefined;
    });
  } catch (e) {
    console.error(e);
  }

  return { topStreams, error };
};
