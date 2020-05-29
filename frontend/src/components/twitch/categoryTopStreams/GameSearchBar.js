import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import GetTopGames from "./GetTopGames";
import {
  StyledGameListElement,
  GameListUlContainer,
  SearchGameForm,
  StyledShowAllButton,
  BackdropChannelList,
  SearchSubmitBtn,
} from "./styledComponents";
import { throttle } from "lodash";
import { MdFormatListBulleted } from "react-icons/md";
import StyledLoadingList from "./LoadingList";
import { CSSTransition } from "react-transition-group";

const scrollToIfNeeded = (parentDiv, childDiv, direction) => {
  const parentRect = parentDiv.getBoundingClientRect();
  const childRect = childDiv.getBoundingClientRect();

  const scrollDown =
    childRect.bottom + 20.5 >= parentRect.bottom || childRect.top + 20.5 >= parentRect.bottom;
  const scrollUp =
    childRect.top - 20.5 <= parentRect.top || childRect.bottom - 20.5 <= parentRect.top;

  if (scrollDown || scrollUp) {
    childDiv.scrollIntoView({ block: "nearest", inline: "nearest" });
    parentDiv.scrollBy({
      top: direction === "Down" && scrollDown ? +41 : direction === "Up" && scrollUp ? -41 : 0,
      behavior: "smooth",
    });
  }
};

const sortAlphaByProp = (a, b) => {
  var gameA = a.name.toLowerCase();
  var gameB = b.name.toLowerCase();
  return gameA.localeCompare(gameB);
};

const sortInputFirst = (input, data) => {
  let caseSensitive = [];
  let caseInsensitive = [];
  let others = [];

  data.forEach((element) => {
    if (element.name.slice(0, input.length) === input) {
      caseSensitive.push(element);
    } else if (element.name.slice(0, input.length).toLowerCase() === input.toLowerCase()) {
      caseInsensitive.push(element);
    } else {
      others.push(element);
    }
  });

  caseSensitive.sort(sortAlphaByProp);
  caseInsensitive.sort(sortAlphaByProp);
  others.sort(sortAlphaByProp);
  return [...caseSensitive, ...caseInsensitive, ...others];
};

export default (props) => {
  const { gameName, videoType } = props;
  const navigate = useNavigate();
  const topGames = useRef();
  const [listIsOpen, setListIsOpen] = useState();
  const [filteredGames, setFilteredGames] = useState();
  const [cursor, setCursor] = useState(0);

  const ulListRef = useRef();
  const inputRef = useRef();

  const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(""),
      bind: {
        value,
        onChange: (event) => {
          try {
            setCursor(0);
            setValue(event.target.value);
            if (listIsOpen && event.target.value && event.target.value !== "") {
              const filtered = topGames.current.filter((game) => {
                return game.name
                  .toLowerCase()
                  .includes((event.target.value || value).toLowerCase());
              });
              if (filtered.length > 1) {
                const asd = sortInputFirst(event.target.value || value, filtered);
                setFilteredGames(asd);
              } else {
                setFilteredGames(filtered);
              }
            } else if (listIsOpen && !event.target.value) {
              setFilteredGames(topGames.current);
            } else if (!listIsOpen && event.target.value) {
              setListIsOpen(true);
            }
          } catch (error) {
            console.log("useInput -> error", error);
          }

          // if (!listIsOpen && event.target.value.length >= 1) {
          //   setListIsOpen(true);
          // }
        },
      },
      showValue: () => {
        return value;
      },
      returnFirstMatchedGame: () => {
        const foundGame = filteredGames.find((games) => {
          return games.name.toLowerCase().includes(value.toLowerCase());
        });
        if (foundGame) {
          return foundGame.name;
        } else {
          return value;
        }
      },
      manualSet: setValue,
    };
  };

  const {
    value: game,
    bind: bindGame,
    //eslint-disable-next-line
    reset: resetGame,
    showValue,
    returnFirstMatchedGame,
    manualSet,
  } = useInput("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    navigate("/category/" + returnFirstMatchedGame());
    setListIsOpen(false);
    // resetGame();
  };

  const fetchTopGamesOnce = useMemo(
    () =>
      throttle(
        () => {
          GetTopGames().then((res) => {
            topGames.current = res;
            setFilteredGames(res);
          });
        },
        5000,
        { leading: true, trailing: false }
      ),
    []
  );

  const handleArrowKey = (e) => {
    try {
      if (filteredGames && filteredGames.length >= 1) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setCursor((cursor) => Math.min(Math.max(cursor + 1, 0), filteredGames.length - 1));
          scrollToIfNeeded(ulListRef.current, document.querySelector(".selected"), "Down");
          manualSet(
            filteredGames[Math.min(Math.max(cursor + 1, 0), filteredGames.length - 1)].name
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setCursor((cursor) => Math.min(Math.max(cursor - 1, 0), filteredGames.length - 1));
          scrollToIfNeeded(ulListRef.current, document.querySelector(".selected"), "Up");
          manualSet(
            filteredGames[Math.min(Math.max(cursor - 1, 0), filteredGames.length - 1)].name
          );
        }
      }
    } catch (error) {
      console.log("handleArrowKey -> error", error);
    }
  };

  useEffect(() => {
    const inputField = inputRef.current;
    inputField.addEventListener("focus", () => {
      setListIsOpen(true);
    });

    return () => {
      inputField.removeEventListener("focus", () => {
        setListIsOpen(true);
      });
    };
  }, []);

  useEffect(() => {
    const input = showValue();
    if (!topGames.current && (listIsOpen || (input && input !== "" && input.length > 1))) {
      fetchTopGamesOnce();
    }
  }, [showValue, listIsOpen, fetchTopGamesOnce, topGames]);

  useEffect(() => {
    return () => {
      setFilteredGames(topGames.current || []);
    };
  }, [topGames]);

  return (
    <>
      <SearchGameForm onSubmit={handleSubmit} open={listIsOpen} onKeyDown={handleArrowKey}>
        <input
          ref={inputRef}
          type='text'
          placeholder={(gameName !== "" && gameName !== undefined ? gameName : "All") + "..."}
          {...bindGame}></input>
        {game && listIsOpen && (
          <SearchSubmitBtn
            to={{
              pathname: `/category/${game}`,
            }}
          />
        )}
        <MdFormatListBulleted
          id='ToggleListBtn'
          onClick={() => {
            setListIsOpen(!listIsOpen);
          }}
          size={42}
        />
        <CSSTransition
          in={listIsOpen}
          timeout={250}
          classNames='fade-250ms'
          onExited={() => {
            topGames.current = null;
            // setTopGames();
            setCursor(0);
          }}
          unmountOnExit>
          <GameListUlContainer ref={ulListRef}>
            <StyledShowAllButton key='showAll'>
              <Link to={"/category/"}>Show all</Link>
            </StyledShowAllButton>

            {filteredGames ? (
              filteredGames.map((game, index) => {
                // console.log("game", game);
                return (
                  <StyledGameListElement
                    key={game.id}
                    selected={index === cursor}
                    className={index === cursor ? "selected" : ""}>
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
