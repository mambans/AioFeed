import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";

import Utilities from "./../../../utilities/Utilities";

const RenderTopGamesList = () => {
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
        key={"showAll"}>
        <Link to={"/twitch/top/"}>Show all</Link>
      </li>
      {topGames.map(game => {
        return (
          <li style={{ justifyContent: "unset", cursor: "pointer" }} key={game.id}>
            <Link to={"/twitch/top/" + game.name}>
              <img
                src={game.box_art_url.replace("{width}", 300).replace("{height}", 300)}
                alt=''
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "10px",
                  borderRadius: "3px",
                }}></img>
              {Utilities.truncate(game.name, 30)}
            </Link>
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
