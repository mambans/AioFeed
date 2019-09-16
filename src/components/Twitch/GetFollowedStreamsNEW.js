import axios from "axios";
// import React, { useState } from "react";

import placeholder from "./../../assets/images/placeholder.png";

async function getFollowedOnlineStreams(lastRan) {
  let error;
  const refreshRate = 120;

  function getProfile(user, tx, db, store, index) {
    return new Promise((resolve, reject) => {
      tx = db.transaction("TwitchProfiles", "readonly");
      store = tx.objectStore("TwitchProfiles");
      index = store.index("user_id");

      let profile = store.get(user);
      profile.onsuccess = () => {
        resolve(profile.result);
      };

      profile.onerror = error => {
        console.log("error: ", profile.result);
        reject(error);
      };
    });
  }

  try {
    let LiveFollowedStreams;
    const currentTime = new Date();

    // Only make requests each 2min.
    if (((currentTime - lastRan) / 1000 >= refreshRate && lastRan != null) || lastRan === null) {
      console.log("Refreshing data");

      // GET all followed channels.
      const followedchannels = await axios
        .get(`https://api.twitch.tv/helix/users/follows?`, {
          params: {
            from_id: 32540540,
            first: 50,
          },
          headers: {
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          },
        })
        .catch(error => {
          console.error("-Error: ", error.message);
          this.setState({
            error: error,
          });
        });

      // Gets data from second page when there are more than 50 followed channels.
      if (followedchannels.data.data.length < followedchannels.data.total) {
        const secondPage = await axios.get(`https://api.twitch.tv/helix/users/follows?`, {
          params: {
            from_id: 32540540,
            first: 50,
            after: followedchannels.data.pagination.cursor,
          },
          headers: {
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          },
        });

        secondPage.data.data.forEach(channel => {
          followedchannels.data.data.push(channel);
        });
      }

      // Make an array of all followed channels id's for easier/less API reuqests.
      const followedChannelsIds = followedchannels.data.data.map(channel => {
        return channel.to_id;
      });

      // Get all Live-streams from followed channels.
      LiveFollowedStreams = await axios.get(`https://api.twitch.tv/helix/streams?`, {
        params: {
          user_id: followedChannelsIds,
        },
        headers: {
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      });

      // Fetch profile imgs
      //------------------------

      // let db;
      // let dbReq = indexedDB.open("Notifies", 1);

      // window.indexedDB =
      //   window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

      try {
        let request = window.indexedDB.open("Notifies", 1),
          db,
          tx,
          store,
          index;

        request.onupgradeneeded = function(event) {
          let db = request.result,
            store = db.createObjectStore("TwitchProfiles", { keyPath: "user_id" }),
            // eslint-disable-next-line
            index = store.createIndex("user_id", "user_id", { unique: false });
        };

        request.onerror = function(event) {
          alert("error opening database " + event.target.errorCode);
        };

        request.onsuccess = function(event) {
          db = request.result;
          db.onerror = function(event) {
            console.log("Error: ", event.target.errorCode);
          };

          //------------------------
          LiveFollowedStreams.data.data.map(async user => {
            let profileImgUrl;

            const profile = await getProfile(user.user_id, tx, db, store, index);

            if (!profile) {
              // if (!localStorage.getItem(`${user.user_id}-profile_img`)) {
              profileImgUrl = await axios.get(`https://api.twitch.tv/helix/users?`, {
                params: {
                  id: user.user_id,
                },
                headers: {
                  "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                },
              });

              // localStorage.setItem(
              //   `${user.user_id}-profile_img`,
              //   profileImgUrl.data.data[0].profile_image_url
              // );

              user.profile_img_url = profileImgUrl.data.data[0].profile_image_url;

              tx = db.transaction("TwitchProfiles", "readwrite");
              store = tx.objectStore("TwitchProfiles");
              index = store.index("user_id");

              store.put({
                user_id: user.user_id,
                url: profileImgUrl.data.data[0].profile_image_url,
              });

              tx.oncomplete = function(event) {
                db.close();
              };

              //------------------------------------------
            } else {
              // user.profile_img_url = localStorage.getItem(`${user.user_id}-profile_img`);
              user.profile_img_url = profile.url;
            }
          });
        };

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
            : (stream.game_img = placeholder);

          return undefined;
        });
      } catch (e) {
        error = e;
        return error;
      }

      // Filters out rerun streams (not live).
      // const FilteredLiveFollowedStreams = LiveFollowedStreams.data.data.filter(stream => {
      //     return stream.type === "live";
      // });

      // const FilteredLiveFollowedStreams = LiveFollowedStreams.data.data;

      return {
        data: LiveFollowedStreams.data.data,
        status: 200,
        refreshTimer: refreshRate - (currentTime - lastRan) / 1000,
        error: error,
      };
    } else {
      console.log(
        "Can auto refresh in " + (refreshRate - (currentTime - lastRan) / 1000) + " sec."
      );
      console.log("Since last refresh: " + (currentTime - lastRan) / 1000 + " sec");
      return { refreshTimer: refreshRate - (currentTime - lastRan) / 1000, status: 401 };
    }
  } catch (error) {
    console.error(error.message);
    return error;
  }
}

export default getFollowedOnlineStreams;