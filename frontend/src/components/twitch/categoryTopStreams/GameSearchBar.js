import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import GetTopGames from "./GetTopGames";
import {
  StyledGameListElement,
  GameListUlContainer,
  SearchGameForm,
  StyledShowAllButton,
  BackdropChannelList,
} from "./styledComponents";
import { throttle } from "lodash";
import { MdFormatListBulleted } from "react-icons/md";
import StyledLoadingList from "./LoadingList";
import { CSSTransition } from "react-transition-group";

export default (props) => {
  const { gameName, videoType } = props;
  const navigate = useNavigate();
  const [topGames, setTopGames] = useState();
  const [listIsOpen, setListIsOpen] = useState();

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
          if (listIsOpen && event.target.value === "") {
            setListIsOpen(false);
          } else if (!listIsOpen && event.target.value.length >= 2) {
            setListIsOpen(true);
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
    if ((!topGames && listIsOpen) || (input && input.length >= 2)) {
      fetchTopGamesOnce();
    }
  }, [showValue, listIsOpen, fetchTopGamesOnce, topGames]);

  return (
    <>
      <SearchGameForm onSubmit={handleSubmit} open={listIsOpen}>
        <input
          type='text'
          placeholder={(gameName !== "" && gameName !== undefined ? gameName : "All") + "..."}
          {...bindGame}></input>
        <MdFormatListBulleted
          id='ToggleListBtn'
          onClick={() => {
            setListIsOpen(!listIsOpen);
          }}
          size={42}
        />
        <CSSTransition in={listIsOpen} timeout={250} classNames='fade-250ms' unmountOnExit>
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
                          setListIsOpen(false);
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
        {listIsOpen && (
          <BackdropChannelList
            id='BackdropChannelList'
            onClick={() => {
              setListIsOpen(!listIsOpen);
            }}
          />
        )}
      </SearchGameForm>
    </>
  );
};
