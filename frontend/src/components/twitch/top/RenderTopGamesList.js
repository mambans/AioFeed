import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import React, { useState, useEffect } from "react";

import GetTopGames from "./GetTopGames";
import Utilities from "./../../../utilities/Utilities";
import { StyledGameListElement, StyledShowAllButton } from "./styledComponents";

const RenderTopGamesList = () => {
  const [topGames, setTopGames] = useState();

  useEffect(() => {
    const fetchAndSetTopGames = async () => {
      const games = await GetTopGames();
      setTopGames(games.data.data);
    };

    fetchAndSetTopGames();
  }, []);

  return topGames ? (
    <ul>
      <StyledShowAllButton key='showAll'>
        <Link to={"/twitch/top/"}>Show all</Link>
      </StyledShowAllButton>
      {topGames.map(game => {
        return (
          <StyledGameListElement key={game.id}>
            <Link to={"/twitch/top/" + game.name}>
              <img src={game.box_art_url.replace("{width}", 300).replace("{height}", 300)} alt='' />
              {game.name}
            </Link>
          </StyledGameListElement>
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
