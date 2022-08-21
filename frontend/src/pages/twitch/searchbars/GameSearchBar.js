import React, { useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ChannelSearchBarItem from './ChannelSearchBarItem';
import {
  DropDownWrapper,
  Input,
  InputWrapper,
  SearchBarSuffixButton,
  Wrapper,
} from './styledComponents';
import debounce from 'lodash/debounce';
import TwitchAPI from '../API';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import loginNameFormat from '../loginNameFormat';
import { getUniqueListBy } from '../../../util';
import { FaSearch } from 'react-icons/fa';
import styled from 'styled-components';
import InifinityScroll from '../channelList/InifinityScroll';
import LoadingList from './../categoryTopStreams/LoadingList';
import useClicksOutside from '../../../hooks/useClicksOutside';

const SearchSubmitIcon = styled(FaSearch).attrs({ size: 18 })``;

const GameSearchBar = ({ searchButton = true, position, placeholder, ...props }) => {
  const [showDropdown, setShowDropdown] = useState();
  const [result, setResult] = useState();
  const [page, setPage] = useState();
  const [loading, setLoading] = useState();
  /* eslint-disable no-unused-vars */
  const [hiddenItems, setHiddenItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  /* eslint-enable no-unused-vars */
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef();
  const inputRef = useRef();
  const listRef = useRef();
  const controller = new AbortController();
  const limit = 25;

  useClicksOutside(ref.current, () => setShowDropdown(false), showDropdown);

  const observer = useMemo(
    () =>
      new IntersectionObserver(
        function (entries) {
          const { visible, hidden } = entries.reduce(
            (acc, item) => {
              if (item.isIntersecting) {
                acc.visible.push(item?.target?.dataset?.['id']);
              } else {
                acc.hidden.push(item?.target?.dataset?.['id']);
              }

              return acc;
            },
            { visible: [], hidden: [] }
          );

          setHiddenItems((c) => {
            return [...c, ...hidden].filter((id) => !visible.includes(id));
          });
          setVisibleItems((c) => {
            return [...c, ...visible].filter((id) => !hidden.includes(id));
          });
        },
        { root: listRef.current, threshhold: 0.1, rootMargin: '200px' }
      ),
    []
  );

  const handleSearch = debounce(
    async (pagination) => {
      try {
        const value = inputRef.current?.value;
        setLoading(true);

        controller.abort();

        const searchResults = await (async () => {
          if (!value) {
            return await TwitchAPI.getTopGames({
              first: limit,
              after: pagination,
              signal: controller.signal,
            });
          }

          return await TwitchAPI.getSearchGames(
            { first: limit, after: pagination, signal: controller.signal },
            value
          );
        })();

        setResult((c) => {
          const res = searchResults?.data?.data.map((i) => ({
            ...i,
            login: i.name,
            profile_image_url: i.box_art_url.replace('{width}', 300).replace('{height}', 300),
            isAGame: true,
          }));

          if (page) return [...c, ...res];

          return res;
        });

        setPage(searchResults?.data?.pagination?.cursor);
        setLoading(false);
      } catch (error) {
        console.log('error:', error);
        setLoading(false);
      }
    },
    100,
    { leading: false, trailing: true }
  );

  const scrollItemIntoView = (item) => {
    item?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  const handleArrowNavigation = (e) => {
    try {
      if (e.key === 'ArrowDown') {
        if (showDropdown) e.preventDefault();

        const selected = listRef.current?.querySelector?.('.selected');
        if (!selected && listRef.current) {
          const firstItem = listRef.current.querySelector('.item');
          if (firstItem) firstItem.classList.add('selected');
        }
        const next = selected.nextSibling;

        if (next && !next.classList.contains('loading') && next.classList.contains('item')) {
          selected.classList.remove('selected');
          next.classList.add('selected');
          //fires onChange and searching which I dpnt want (block onChange?)
          // inputRef.current.value = next.querySelector('.title')?.textContent;

          scrollItemIntoView(next);
        }
        return;
      }
      if (e.key === 'ArrowUp') {
        if (showDropdown) e.preventDefault();

        const selected = listRef.current?.querySelector?.('.selected');

        const previous = selected?.previousSibling;
        if (previous && !previous.classList.contains('loading')) {
          selected.classList.remove('selected');
          previous.classList.add('selected');
          //fires onChange and searching which I dpnt want (block onChange?)
          // inputRef.current.value = previous.querySelector('.title')?.textContent;
          scrollItemIntoView(previous);
        } else if (inputRef.current) {
          selected?.classList?.remove('selected');
          inputRef.current.focus();
        }
        return;
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  useEventListenerMemo('keydown', handleArrowNavigation, ref.current);

  const onSubmit = (event) => {
    const selected = listRef.current?.querySelector?.('.selected');
    const elementTitle = selected?.querySelector?.('.title');
    const value = (elementTitle?.textContent || inputRef.current.value).trimStart();

    try {
      if (elementTitle) {
        event.preventDefault?.();
      }
      if (props.onSubmit) {
        props.onSubmit?.(value);
        return;
      }
      if (props.onChange) {
        props.onChange?.(value);
        return;
      }

      if (location.pathname === '/feed') {
        window.open(`/${value}`);
      } else {
        navigate(`/${value}`);
      }
    } catch (error) {
    } finally {
      setShowDropdown(false);
      inputRef.current.value = value;
    }
  };

  const onChange = (e) => {
    setPage(null);
    handleSearch();
    props?.onChange?.(e.target.value?.trimStart?.());
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSubmit(e);
    }
  };

  const onFocus = async () => {
    setShowDropdown(true);
    handleSearch();
  };

  // const onBlur = () => {
  //   //FIX, fires when clicking on buttons
  //   setShowDropdown(false);
  // };

  const loadmore = () => {
    if (page) {
      return handleSearch(page);
    }
  };

  const items = getUniqueListBy(
    result
      ?.filter((i) => {
        return loginNameFormat(i)?.toLowerCase()?.includes(inputRef.current?.value?.trim?.());
      })
      .sort(
        (a, b) =>
          inputRef.current?.value?.trim?.() &&
          loginNameFormat(a).replace(inputRef.current?.value?.trim?.())?.length -
            loginNameFormat(b).replace(inputRef.current?.value?.trim?.())?.length
      ),
    'id'
  );

  return (
    <Wrapper
      ref={ref}
      tabIndex={1}
      style={props.style}
      onTransitionEnd={() => {}}
      // onBlur={onBlur}
      open={showDropdown}
    >
      <InputWrapper>
        <Input
          ref={inputRef}
          onChange={onChange}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
          placeholder={placeholder || 'Game..'}
        />
        {searchButton && (
          <SearchBarSuffixButton
            onClick={onSubmit}
            disabled={!showDropdown || !inputRef.current?.value?.trim?.()}
          >
            <SearchSubmitIcon />
          </SearchBarSuffixButton>
        )}
      </InputWrapper>
      {showDropdown && (
        <DropDownWrapper
          ref={listRef}
          position={position}
          width={
            String(position === 'fixed' && 300)
            // String(position === 'fixed' && ref.current?.getBoundingClientRect?.()?.width)
          }
        >
          <div style={{ textAlign: 'center' }}>
            {loading ? 'Loading..' : `Total: ${items?.length || ''}`}
          </div>
          <StyledShowAllButton to={'/category/'} key='showAll'>
            Show all
          </StyledShowAllButton>
          {items?.map((i, index) => {
            return (
              <ChannelSearchBarItem
                searchInput={inputRef.current?.value}
                key={i.id}
                item={i}
                className={index === 0 && 'selected'}
                observer={observer}
                // visible={visibleItems.includes(String(i.id))}
                visible={!hiddenItems.includes(String(i.id))}
                // visible={true}
              />
            );
          })}
          {loading && <LoadingList amount={2} style={{ paddingLeft: '10px' }} />}
          {page && !loading && <InifinityScroll observerFunction={loadmore} />}
        </DropDownWrapper>
      )}
    </Wrapper>
  );
};

export default GameSearchBar;
export const StyledShowAllButton = styled(Link)`
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  color: #ffffff;
  width: 100%;
  display: block;

  &:hover {
    color: #ffffff;
  }
`;
