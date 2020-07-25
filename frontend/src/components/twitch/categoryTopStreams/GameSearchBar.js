import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GetTopGames from './GetTopGames';
import {
  StyledGameListElement,
  GameListUlContainer,
  SearchGameForm,
  StyledShowAllButton,
  BackdropChannelList,
  SearchSubmitBtn,
} from './styledComponents';
import { throttle } from 'lodash';
import { MdFormatListBulleted } from 'react-icons/md';
import StyledLoadingList from './LoadingList';
import { CSSTransition } from 'react-transition-group';
import { scrollToIfNeeded, sortInputFirst } from '../channelList';
import API from '../API';
// import useEventListener from '../../../hooks/useEventListener';
import useLockBodyScroll from '../../../hooks/useLockBodyScroll';

export default (props) => {
  const {
    gameName,
    videoType,
    style,
    direction = 'left',
    showButton = true,
    inputFontSize = 'inherit',
    inputStyle = {},
    alwaysFetchNew = false,
    openInNewTab = false,
    position,
  } = props;
  const navigate = useNavigate();
  const topGames = useRef();
  const [listIsOpen, setListIsOpen] = useState();
  const [filteredGames, setFilteredGames] = useState();
  const [cursor, setCursor] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showDropdown, setShowDropdown] = useState(true);

  const ulListRef = useRef();
  const inputRef = useRef();
  const endOfListRef = useRef();
  const searchTimer = useRef();

  useLockBodyScroll(listIsOpen);

  // useEventListener(
  //   'focus',
  //   () => {
  //     setListIsOpen(true);
  //   },
  //   inputRef.current
  // );

  useEffect(() => {
    const inputField = inputRef.current;
    inputField.addEventListener('focus', () => {
      setListIsOpen(true);
    });

    return () => {
      inputField.removeEventListener('focus', () => {
        setListIsOpen(true);
      });
    };
  }, []);

  const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(''),
      bind: {
        value,
        onChange: (event) => {
          try {
            setCursor(0);
            setValue(event.target?.value);
            if (listIsOpen && event.target?.value && event.target?.value !== '') {
              const filtered = topGames.current?.data.filter((game) => {
                return game.name
                  .toLowerCase()
                  .includes((event.target?.value || value).toLowerCase());
              });

              const sortedList =
                filtered?.length > 1
                  ? sortInputFirst(event.target?.value || value, filtered)
                  : filtered || [];
              setFilteredGames(sortedList);

              clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(async () => {
                await API.getSearchGames({
                  query: event.target?.value || value,
                  params: { first: 20 },
                }).then((res) => {
                  // const searchResult = res.data.data.map((item) => ({
                  //   ...item,
                  //   user_id: item.id,
                  //   user_name: item.display_name,
                  // }));
                  const searchResult = res.data.data;
                  setFilteredGames([...sortedList, ...searchResult]);
                });
              }, 500);
            } else if (listIsOpen && !event.target?.value) {
              if (topGames.current?.data) {
                setFilteredGames(topGames.current?.data);
                setTimeout(() => {
                  if (
                    endOfListRef.current &&
                    topGames.current?.data.length >= 1 &&
                    topGames.current?.pagination.cursor
                  ) {
                    observer.observe(endOfListRef.current);
                  }
                }, 0);
              } else {
                setFilteredGames([]);
              }
            } else if (!listIsOpen && event.target?.value) {
              setListIsOpen(true);
            }
          } catch (error) {
            console.error(error);
          }
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

  const observer = useMemo(
    () =>
      new IntersectionObserver(
        function (entries) {
          if (ulListRef.current) {
            ulListRef.current.addEventListener(
              'wheel',
              throttle(
                function () {
                  if (entries[0].isIntersecting === true && topGames.current?.data.length <= 450) {
                    setLoadingMore(true);
                    GetTopGames(topGames.current?.pagination.cursor)
                      .then((res) => {
                        if (res.data && res.data.length >= 1) {
                          const items = [...topGames.current?.data, ...res.data];
                          const uniqueItems = items.filter((item, index, self) => {
                            return (
                              self.findIndex((t) => t.id === item.id && t.name === item.name) ===
                              index
                            );
                          });

                          topGames.current = {
                            data: uniqueItems,
                            pagination: res.pagination,
                          };

                          setFilteredGames((curr) => {
                            const items = [...curr, ...res.data];
                            const uniqueItems = items.filter((item, index, self) => {
                              return (
                                self.findIndex((t) => t.id === item.id && t.name === item.name) ===
                                index
                              );
                            });

                            return uniqueItems;
                          });
                          setLoadingMore(false);
                        }
                      })
                      .catch((e) => {
                        console.error('e', e);
                        setLoadingMore(false);
                      });
                  }
                  return false;
                },
                5000,
                { trailing: false, leading: true }
              )
            );
          }
        },
        { threshold: 0 }
      ),
    []
  );

  const {
    value: game,
    bind: bindGame,
    //eslint-disable-next-line
    reset: resetGame,
    showValue,
    returnFirstMatchedGame,
    manualSet,
  } = useInput('');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    openInNewTab
      ? window.open(`/category/${returnFirstMatchedGame()}`)
      : navigate(`/category/${returnFirstMatchedGame()}`);
    manualSet(returnFirstMatchedGame());
    setListIsOpen(false);
    if (openInNewTab) {
      resetGame();
      inputRef.current.blur();
    }
  };

  const fetchTopGamesOnce = useMemo(
    () =>
      throttle(
        () => {
          GetTopGames()
            .then((res) => {
              topGames.current = res;
              setFilteredGames(res.data);

              if (endOfListRef.current && res.data?.length >= 1 && res.pagination.cursor) {
                observer.observe(endOfListRef.current);
              } else {
                if (!topGames.current) setShowDropdown(false);
              }
            })
            .catch(() => {
              if (!topGames.current) setShowDropdown(false);
            });
        },
        20000,
        { leading: true, trailing: false }
      ),
    [observer]
  );

  const handleArrowKey = (e) => {
    try {
      if (filteredGames?.length > 1) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setCursor((cursor) => Math.min(Math.max(cursor + 1, 0), filteredGames.length - 1));
          scrollToIfNeeded(ulListRef.current, document.querySelector('.selected'), 'Down');
          manualSet(
            filteredGames[Math.min(Math.max(cursor + 1, 0), filteredGames?.length - 1)].name
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCursor((cursor) => Math.min(Math.max(cursor - 1, 0), filteredGames.length - 1));
          scrollToIfNeeded(ulListRef.current, document.querySelector('.selected'), 'Up');
          manualSet(
            filteredGames[Math.min(Math.max(cursor - 1, 0), filteredGames?.length - 1)].name
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const input = showValue();
    if (
      (alwaysFetchNew || !topGames.current?.data) &&
      (listIsOpen || (input && input !== '' && input.length > 1))
    ) {
      fetchTopGamesOnce();
    }
  }, [showValue, listIsOpen, fetchTopGamesOnce, topGames, observer, alwaysFetchNew]);

  useEffect(() => {
    return () => {
      setFilteredGames(topGames.current?.data || []);
    };
  }, [topGames]);

  return (
    <>
      <SearchGameForm
        onSubmit={handleSubmit}
        open={listIsOpen}
        onKeyDown={handleArrowKey}
        style={{ ...style }}
        direction={direction}
        showButton={showButton}
        inputFontSize={inputFontSize}
        text={game}
      >
        <input
          ref={inputRef}
          type='text'
          spellCheck='false'
          style={{ ...inputStyle }}
          placeholder={`${gameName !== '' && gameName !== undefined ? gameName : 'Game'}..`}
          {...bindGame}
        ></input>
        <SearchSubmitBtn
          disabled={!game}
          to={{
            pathname: `/category/${game}`,
          }}
        />
        {showButton && (
          <MdFormatListBulleted
            id='ToggleListBtn'
            onClick={() => {
              setListIsOpen(!listIsOpen);
            }}
            size={42}
          />
        )}
        <CSSTransition
          in={showDropdown && listIsOpen}
          timeout={250}
          classNames='fade-250ms'
          onExited={() => {
            topGames.current = null;
            // setTopGames();
            setCursor(0);
          }}
          unmountOnExit
        >
          <GameListUlContainer ref={ulListRef} position={position}>
            <StyledShowAllButton key='showAll'>
              <Link to={'/category/'}>Show all</Link>
            </StyledShowAllButton>

            {Array.isArray(filteredGames) ? (
              <>
                {filteredGames?.map((game, index) => {
                  return (
                    <StyledGameListElement
                      key={game.id}
                      selected={index === cursor}
                      className={index === cursor ? 'selected' : ''}
                    >
                      <Link
                        onClick={() => {
                          setListIsOpen(false);
                        }}
                        to={{
                          pathname: '/category/' + game.name,
                          state: {
                            p_videoType: videoType,
                          },
                        }}
                      >
                        <img
                          src={game.box_art_url.replace('{width}', 300).replace('{height}', 300)}
                          alt=''
                        />
                        {game.name}
                      </Link>
                    </StyledGameListElement>
                  );
                })}
                {loadingMore && <StyledLoadingList amount={3} />}
                {(!game || game === '') && (
                  <div ref={endOfListRef} style={{ width: '100%', height: '5px' }} />
                )}
              </>
            ) : (
              <StyledLoadingList amount={12} />
            )}
          </GameListUlContainer>
        </CSSTransition>
      </SearchGameForm>
      {listIsOpen && (
        <BackdropChannelList
          id='BackdropChannelList'
          onClick={() => {
            setListIsOpen(!listIsOpen);
            // setFilteredGames(topGames.current);
            resetGame();
          }}
        />
      )}
    </>
  );
};
