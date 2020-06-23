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

export default (props) => {
  const {
    gameName,
    videoType,
    style,
    direction = 'left',
    showButton = true,
    fixedPlaceholder,
    inputFontSize = 'inherit',
    inputStyle = {},
    compressedWidth = '125px',
    alwaysFetchNew = false,
  } = props;
  const navigate = useNavigate();
  const topGames = useRef();
  const [listIsOpen, setListIsOpen] = useState();
  const [filteredGames, setFilteredGames] = useState();
  const [cursor, setCursor] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const ulListRef = useRef();
  const inputRef = useRef();
  const endOfListRef = useRef();

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
            setValue(event.target.value);
            if (listIsOpen && event.target.value && event.target.value !== '') {
              const filtered = topGames.current.data.filter((game) => {
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
              if (topGames.current && topGames.current.data) {
                setFilteredGames(topGames.current.data);
                setTimeout(() => {
                  if (
                    endOfListRef.current &&
                    topGames.current.data.length >= 1 &&
                    topGames.current.pagination.cursor
                  ) {
                    observer.observe(endOfListRef.current);
                  }
                }, 0);
              } else {
                setFilteredGames([]);
              }
            } else if (!listIsOpen && event.target.value) {
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
                  if (
                    entries[0].isIntersecting === true &&
                    topGames.current &&
                    topGames.current.data.length <= 450
                  ) {
                    setLoadingMore(true);
                    GetTopGames(topGames.current.pagination.cursor)
                      .then((res) => {
                        if (res.data && res.data.length >= 1) {
                          const items = [...topGames.current.data, ...res.data];
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
                { trailing: false, leading: true },
              ),
            );
          }
        },
        { threshold: 0 },
      ),
    [],
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
    navigate('/category/' + returnFirstMatchedGame());
    manualSet(returnFirstMatchedGame());
    setListIsOpen(false);
    // resetGame();
  };

  const fetchTopGamesOnce = useMemo(
    () =>
      throttle(
        () => {
          GetTopGames().then((res) => {
            topGames.current = res;
            setFilteredGames(res.data);
            if (endOfListRef.current && res.data && res.data.length >= 1 && res.pagination.cursor) {
              observer.observe(endOfListRef.current);
            }
          });
        },
        5000,
        { leading: true, trailing: false },
      ),
    [observer],
  );

  const handleArrowKey = (e) => {
    try {
      if (filteredGames && filteredGames.length > 1) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setCursor((cursor) => Math.min(Math.max(cursor + 1, 0), filteredGames.length - 1));
          scrollToIfNeeded(ulListRef.current, document.querySelector('.selected'), 'Down');
          manualSet(
            filteredGames[Math.min(Math.max(cursor + 1, 0), filteredGames.length - 1)].name,
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCursor((cursor) => Math.min(Math.max(cursor - 1, 0), filteredGames.length - 1));
          scrollToIfNeeded(ulListRef.current, document.querySelector('.selected'), 'Up');
          manualSet(
            filteredGames[Math.min(Math.max(cursor - 1, 0), filteredGames.length - 1)].name,
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const endOfListRefEle = endOfListRef.current;
    const inputField = inputRef.current;
    inputField.addEventListener('focus', () => {
      setListIsOpen(true);
    });

    return () => {
      inputField.removeEventListener('focus', () => {
        setListIsOpen(true);
        if (endOfListRefEle) observer.unobserve(endOfListRefEle);
      });
    };
  }, [observer]);

  useEffect(() => {
    const input = showValue();
    if (
      (alwaysFetchNew || !topGames.current || !topGames.current.data) &&
      (listIsOpen || (input && input !== '' && input.length > 1))
    ) {
      fetchTopGamesOnce();
    }
  }, [showValue, listIsOpen, fetchTopGamesOnce, topGames, observer, alwaysFetchNew]);

  useEffect(() => {
    return () => {
      setFilteredGames((topGames.current && topGames.current.data) || []);
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
        compressedWidth={compressedWidth}
      >
        <input
          ref={inputRef}
          type='text'
          spellCheck='false'
          style={{ ...inputStyle }}
          placeholder={
            fixedPlaceholder || `${gameName !== '' && gameName !== undefined ? gameName : 'All'}...`
          }
          {...bindGame}
        ></input>
        {game && listIsOpen && (
          <SearchSubmitBtn
            to={{
              pathname: `/category/${game}`,
            }}
          />
        )}
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
          in={listIsOpen}
          timeout={250}
          classNames='fade-250ms'
          onExited={() => {
            topGames.current = null;
            // setTopGames();
            setCursor(0);
          }}
          unmountOnExit
        >
          <GameListUlContainer ref={ulListRef}>
            <StyledShowAllButton key='showAll'>
              <Link to={'/category/'}>Show all</Link>
            </StyledShowAllButton>

            {filteredGames ? (
              <>
                {filteredGames.map((game, index) => {
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
