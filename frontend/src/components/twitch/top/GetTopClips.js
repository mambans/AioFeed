import axios from "axios";

import Utilities from "./../../../utilities/Utilities";
import GetCachedProfiles from "./../GetCachedProfiles";

export default async (category, setSortByTime, page) => {
  let game;
  let error;
  const nrStreams =
    Math.floor((document.documentElement.clientWidth - 150) / 350) *
    Math.floor((document.documentElement.clientHeight - (65 + 60)) / 351);

  if (category && category !== "undefined") {
    game = await axios
      .get(`https://api.twitch.tv/helix/games`, {
        params: {
          name: category,
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
  try {
    const topClips = await axios
      .get(`https://api.twitch.tv/helix/clips`, {
        params: {
          first: nrStreams,
          game_id: game.id,
          after: page ? page.pagination.cursor : null,
          started_at:
            setSortByTime &&
            new Date(new Date().setDate(new Date().getDate() - setSortByTime)).toISOString(),
          ended_at: setSortByTime && new Date().toISOString(),
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

    const TwitchProfiles = GetCachedProfiles();

    const noCachedProfileArrayObject = await topClips.data.data.filter(user => {
      return !Object.keys(TwitchProfiles).some(id => id === user.broadcaster_id);
    });

    const noCachedProfileArrayIds = Object.values(noCachedProfileArrayObject).map(user => {
      return user.broadcaster_id;
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
      await topClips.data.data.map(async user => {
        if (!TwitchProfiles[user.broadcaster_id]) {
          user.profile_img_url = newProfileImgUrls.data.data.find(p_user => {
            return p_user.id === user.broadcaster_id;
          }).profile_image_url;
        } else {
          user.profile_img_url = TwitchProfiles[user.broadcaster_id];
        }
        return user;
      })
    ).then(res => {
      const newProfiles = res.reduce(
        // eslint-disable-next-line no-sequences
        (obj, item) => ((obj[item.broadcaster_id] = item.profile_img_url), obj),
        {}
      );

      const FinallTwitchProfilesObj = { ...newProfiles, ...TwitchProfiles };

      localStorage.setItem("TwitchProfiles", JSON.stringify(FinallTwitchProfilesObj));
    });

    // Removes game id duplicates before sending game request.
    const games = [
      ...new Set(
        topClips.data.data.map(channel => {
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
    topClips.data.data.map(stream => {
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
    topClips.data.data.map(stream => {
      gameNames.data.data.find(game => {
        return game.id === stream.game_id;
      }) !== undefined
        ? (stream.game_img = gameNames.data.data.find(game => {
            return game.id === stream.game_id;
          }).box_art_url)
        : (stream.game_img = `${process.env.PUBLIC_URL}/images/placeholder.jpg`);

      return undefined;
    });

    return { topData: topClips, error };
  } catch (e) {
    console.error(e);
  }
};
