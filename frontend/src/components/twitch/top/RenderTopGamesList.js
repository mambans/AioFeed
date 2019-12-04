import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";

import GetTopStreams from "./GetTopStreams";
import Utilities from "./../../../utilities/Utilities";

const RenderTopGamesList = data => {
  const [topGames, setTopGames] = useState();

  const fetchTopGames = useCallback(async () => {
    const topGames = await axios.get(`https://api.twitch.tv/helix/games/top`, {
      params: {
        first: 50,
      },
      headers: {
        Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
        "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
      },
    });
    return topGames;
  }, []);

  const gameOnClick = async game => {
    data.setIsLoaded(false);
    data.setGame(game || "All");
    GetTopStreams(game).then(res => {
      data.setTopStreams(res.data.data);
      data.setIsLoaded(true);
    });
  };

  useEffect(() => {
    const fetchAndSetTopGames = async () => {
      const games = await fetchTopGames();
      setTopGames(games.data.data);
    };

    fetchAndSetTopGames();
  }, [fetchTopGames]);

  return topGames ? (
    <ul>
      <li
        style={{
          cursor: "pointer",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "1.1rem",
        }}
        key={"showAll"}
        onClick={() => {
          gameOnClick();
        }}>
        Show all
      </li>
      {topGames.map(game => {
        return (
          <li
            style={{ justifyContent: "unset", cursor: "pointer" }}
            key={game.id}
            onClick={() => {
              gameOnClick(game);
            }}>
            <img
              src={game.box_art_url.replace("{width}", 300).replace("{height}", 300)}
              alt=''
              style={{
                width: "30px",
                height: "30px",
                marginRight: "10px",
                borderRadius: "3px",
              }}></img>
            <button
              style={{
                background: "none",
                border: "none",
                color: "white",
                textAlign: "left",
                outline: "none",
              }}>
              {game.name}
            </button>
          </li>
        );
      })}
    </ul>
  ) : (
    <ul>
      <Spinner animation='grow' role='status' style={Utilities.loadingSpinner} variant='light'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    </ul>
  );
};

export default RenderTopGamesList;
