import React, { useState, useEffect, useMemo } from "react";
import { Redirect, Link } from "react-router-dom";
import GetTopGames from "./GetTopGames";
import {
  StyledGameListElement,
  GameListUlContainer,
  SearchGameForm,
  StyledShowAllButton,
} from "./styledComponents";
import _ from "lodash";
import { MdFormatListBulleted } from "react-icons/md";
import StyledLoadingList from "./LoadingList";

const GameSearchBar = props => {
  const { gameName, videoType } = props;
  const [redirect, setRedirect] = useState(false);
  const [topGames, setTopGames] = useState();
  const [openGameList, setOpenGameList] = useState();

  const useInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(""),
      bind: {
        value,
        onChange: event => {
          setValue(event.target.value);
          if (openGameList && event.target.value === "") {
            setOpenGameList(false);
          }
        },
      },
      showValue: () => {
        return value;
      },
    };
  };

  //eslint-disable-next-line
  const { value: game, bind: bindGame, reset: resetGame, showValue } = useInput("");

  const handleSubmit = evt => {
    evt.preventDefault();
    setRedirect(true);
    // resetGame();
  };

  const fetchTopGamesOnce = useMemo(
    () =>
      _.throttle(
        () => {
          GetTopGames().then(res => {
            setTopGames(res.data.data);
          });
        },
        5000,
        { leading: true, trailing: false }
      ),
    []
  );

  useEffect(() => {
    const input = showValue();
    if ((!topGames && openGameList) || (input && input.length >= 2)) {
      fetchTopGamesOnce();
    }
  }, [showValue, openGameList, fetchTopGamesOnce, topGames]);

  return (
    <>
      {redirect ? <Redirect to={"/game/" + game} /> : null}
      <SearchGameForm onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder={(gameName !== "" && gameName !== undefined ? gameName : "All") + "..."}
          {...bindGame}></input>
        <MdFormatListBulleted
          onClick={() => {
            setOpenGameList(!openGameList);
          }}
          size={42}
        />
        {openGameList || (showValue() && showValue().length >= 2) ? (
          <GameListUlContainer>
            {topGames ? (
              <StyledShowAllButton key='showAll'>
                <Link to={"/game/"}>Show all</Link>
              </StyledShowAllButton>
            ) : null}
            {topGames ? (
              topGames
                .filter(game => {
                  return game.name.toLowerCase().includes(showValue());
                })
                .map(game => {
                  return (
                    <StyledGameListElement key={game.id}>
                      <Link
                        to={{
                          pathname: "/game/" + game.name,
                          state: {
                            p_videoType: videoType,
                          },
                        }}>
                        <img
                          src={game.box_art_url.replace("{width}", 300).replace("{height}", 300)}
                          alt=''
                        />
                        {game.name}
                      </Link>
                    </StyledGameListElement>
                  );
                })
            ) : (
              <StyledLoadingList amount={12} />
            )}
          </GameListUlContainer>
        ) : null}
      </SearchGameForm>
    </>
  );
};

export default GameSearchBar;
