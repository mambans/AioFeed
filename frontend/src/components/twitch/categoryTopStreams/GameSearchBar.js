import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import GetTopGames from "./GetTopGames";
import {
  StyledGameListElement,
  GameListUlContainer,
  SearchGameForm,
  StyledShowAllButton,
} from "./styledComponents";
import { throttle } from "lodash";
import { MdFormatListBulleted } from "react-icons/md";
import StyledLoadingList from "./LoadingList";
import { CSSTransition } from "react-transition-group";

export default (props) => {
  const { gameName, videoType } = props;
  const navigate = useNavigate();
  const [topGames, setTopGames] = useState();
  const [openGameList, setOpenGameList] = useState();

  const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(""),
      bind: {
        value,
        onChange: (event) => {
          setValue(event.target.value);
          if (openGameList && event.target.value === "") {
            setOpenGameList(false);
          } else if (!openGameList && event.target.value.length >= 2) {
            setOpenGameList(true);
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

  const handleSubmit = (evt) => {
    evt.preventDefault();
    navigate("/category/" + game);
    // resetGame();
  };

  const fetchTopGamesOnce = useMemo(
    () =>
      throttle(
        () => {
          GetTopGames().then((res) => {
            setTopGames(res);
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
      <SearchGameForm onSubmit={handleSubmit} open={openGameList}>
        <input
          type='text'
          placeholder={(gameName !== "" && gameName !== undefined ? gameName : "All") + "..."}
          {...bindGame}></input>
        <MdFormatListBulleted
          id='ToggleListBtn'
          onClick={() => {
            setOpenGameList(!openGameList);
          }}
          size={42}
        />
        <CSSTransition in={openGameList} timeout={250} classNames='fade-250ms' unmountOnExit>
          <GameListUlContainer>
            {topGames && (
              <StyledShowAllButton key='showAll'>
                <Link to={"/category/"}>Show all</Link>
              </StyledShowAllButton>
            )}
            {topGames ? (
              topGames
                .filter((game) => {
                  return game.name.toLowerCase().includes(showValue());
                })
                .map((game) => {
                  return (
                    <StyledGameListElement key={game.id}>
                      <Link
                        onClick={() => {
                          setOpenGameList(false);
                        }}
                        to={{
                          pathname: "/category/" + game.name,
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
        </CSSTransition>
      </SearchGameForm>
    </>
  );
};
