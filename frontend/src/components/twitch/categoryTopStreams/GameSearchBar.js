import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import GetTopGames from './GetTopGames';
import {
  StyledGameListElement,
  GameListUlContainer,
  StyledShowAllButton,
} from './styledComponents';

import { throttle } from 'lodash';
import API from '../API';
import handleArrowNavigation from '../channelList/handleArrowNavigation';
import InifinityScroll from '../channelList/InifinityScroll';
import sortByInput from '../channelList/sortByInput';
import StyledLoadingList from './LoadingList';
import SearchList from '../../SearchList';

const removeDuplicates = (items) =>
  items.filter((item, index, self) => self.findIndex((t) => t.id === item.id) === index);

export default (props) => {
  const {
    gameName,
    videoType,
    style,
    showButton = true,
    inputFontSize = 'inherit',
    inputStyle = {},
    openInNewTab = false,
    position,
  } = props;
  const navigate = useNavigate();

  const [topGames, setTopGames] = useState();
  const [listIsOpen, setListIsOpen] = useState();
  const [searchResults, setSearchResults] = useState();
  const [cursor, setCursor] = useState({ position: 0 });
  const [showDropdown, setShowDropdown] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const ulListRef = useRef();
  const searchTimer = useRef();
  const savedFilteredInputMatched = useRef();

  const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(''),
      bind: {
        value,
        onChange: (event) => {
          const { value: input } = event.target;
          try {
            setValue(input);
            setCursor({ position: 0 });
            if (listIsOpen && input && input !== '') {
              clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(async () => {
                setSearchResults();
                await API.getSearchGames({
                  query: input || value,
                  params: { first: 20 },
                }).then((res) => {
                  setSearchResults({
                    data: res?.data.data,
                    nextPage: res?.data?.pagination.cursor,
                  });
                });
              }, 500);
            } else if (listIsOpen && !input) {
              setSearchResults();
            } else if (!listIsOpen && input) {
              setListIsOpen(true);
            }
          } catch (error) {
            console.error(error);
          }
        },
      },
      returnFirstMatchedGame: () => {
        const foundGame = filteredInputMatched?.data?.find((games) =>
          games.name?.toLowerCase().includes(value?.toLowerCase())
        );

        return foundGame?.name || value;
      },
    };
  };

  const {
    value: game,
    bind: bindGame,
    reset: resetGame,
    setValue: setGame,
    returnFirstMatchedGame,
  } = useInput('');

  const filteredInputMatched = useMemo(() => {
    if (cursor.used) return savedFilteredInputMatched.current;

    const filteredTopChannels =
      (game && sortByInput(game, topGames?.data)) ||
      topGames?.data?.filter((item) => {
        return item.name?.toLowerCase().includes(game?.toLowerCase() || '');
      });

    const uniqueGames = removeDuplicates([
      ...(filteredTopChannels || []),
      ...(searchResults?.data || []),
    ]);

    const fianllObj = {
      data: uniqueGames,
      nextPage: topGames?.nextPage,
    };

    savedFilteredInputMatched.current = fianllObj;

    return fianllObj;
  }, [game, searchResults, topGames, cursor.used]);

  const fetchTopGamesOnce = useMemo(
    () =>
      throttle(
        async () => {
          GetTopGames().then((res) =>
            setTopGames({ data: res.data, nextPage: res.pagination?.cursor })
          );
        },
        5000,
        { leading: true, trailing: false }
      ),
    []
  );

  const handleArrowKey = (event) =>
    handleArrowNavigation(
      event,
      filteredInputMatched?.data,
      cursor,
      setCursor,
      setGame,
      ulListRef.current
    );

  const observerFunction = async function () {
    if ((searchResults?.nextPage || topGames?.nextPage) && !loadingMore) {
      setLoadingMore(true);

      if (game && game !== '' && searchResults?.nextPage) {
        await API.getSearchGames({
          query: game,
          params: { first: 20, after: searchResults?.nextPage },
        }).then((res) => {
          setSearchResults((curr) => ({
            data: removeDuplicates([...(curr.data || []), ...(res.data?.data || [])]),
            nextPage: res.data.pagination?.cursor,
          }));
          setLoadingMore(false);
        });
      } else {
        GetTopGames(topGames?.nextPage).then((res) => {
          if (res.data?.length >= 1) {
            setTopGames((curr) => ({
              data: removeDuplicates([...(curr?.data || []), ...(res?.data || [])]),
              nextPage: res.pagination?.cursor,
            }));
            setLoadingMore(false);
          }
        });
      }
    }
    return false;
  };

  const onExited = () => {
    setTopGames();
    setSearchResults();
  };

  const handleSubmit = () => {
    openInNewTab
      ? window.open(`/category/${returnFirstMatchedGame()}`)
      : navigate(`/category/${returnFirstMatchedGame()}`);
    if (openInNewTab) {
      resetGame();
    }
  };

  useEffect(() => {
    if (listIsOpen) {
      fetchTopGamesOnce().catch((e) => {
        setShowDropdown(false);
        console.warn(e);
      });
    }
  }, [listIsOpen, fetchTopGamesOnce]);

  return (
    <>
      <SearchList
        style={style}
        onSubmit={handleSubmit}
        listIsOpen={listIsOpen}
        onKeyDown={handleArrowKey}
        showButton={showButton}
        inputFontSize={inputFontSize}
        input={game}
        inputStyle={inputStyle}
        placeholder={`${gameName || 'Game'}..`}
        resetInput={resetGame}
        bindInput={bindGame}
        type={'category'}
        showDropdown={showDropdown}
        onExited={onExited}
        setListIsOpen={setListIsOpen}
        setCursor={setCursor}
        searchBtnPath={`/category/${game}`}
        btnDisabled={!game}
      >
        <GameListUlContainer ref={ulListRef} position={position}>
          <StyledShowAllButton key='showAll'>
            <Link to={'/category/'}>Show all</Link>
          </StyledShowAllButton>

          {filteredInputMatched?.data?.length >= 1 ? (
            <>
              {filteredInputMatched?.data?.map((game, index) => (
                <StyledGameListElement
                  key={game?.id}
                  selected={index === cursor.position}
                  className={index === cursor.position ? 'selected' : ''}
                >
                  <Link
                    onClick={() => setListIsOpen(false)}
                    to={{
                      pathname: '/category/' + game?.name,
                      state: {
                        p_videoType: videoType,
                      },
                    }}
                  >
                    <img
                      src={game?.box_art_url?.replace('{width}', 300)?.replace('{height}', 300)}
                      alt=''
                    />
                    {game?.name}
                  </Link>
                </StyledGameListElement>
              ))}
              {filteredInputMatched?.data && filteredInputMatched?.nextPage && (
                <InifinityScroll observerFunction={observerFunction} />
              )}
            </>
          ) : (
            <StyledLoadingList amount={12} />
          )}
        </GameListUlContainer>
      </SearchList>
    </>
  );
};
