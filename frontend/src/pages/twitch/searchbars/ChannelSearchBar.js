import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import getMyFollowedChannels from '../getMyFollowedChannels';
import addVideoExtraData from '../AddVideoExtraData';
import loginNameFormat from '../loginNameFormat';
import { getUniqueListBy } from '../../../util';
import { FaSearch } from 'react-icons/fa';
import styled from 'styled-components';
import InifinityScroll from '../channelList/InifinityScroll';
import LoadingList from './../categoryTopStreams/LoadingList';
import useClicksOutside from '../../../hooks/useClicksOutside';

const SearchSubmitIcon = styled(FaSearch).attrs({ size: 18 })``;

const ChannelSearchBar = ({
  searchButton = true,
  position,
  placeholder,
  hideExtraButtons,
  ...props
}) => {
  const [showDropdown, setShowDropdown] = useState();
  const [result, setResult] = useState();
  const [page, setPage] = useState();
  const [loading, setLoading] = useState();
  /* eslint-disable no-unused-vars */
  const [hiddenItems, setHiddenItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [rnd, setRnd] = useState();
  /* eslint-enable no-unused-vars */
  const [followedChannels, setFollowedChannels] = useState([]);
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
        { root: listRef.current, threshhold: 0.1, rootMargin: '50px' }
      ),
    []
  );

  const handleSearch = debounce(
    async (e) => {
      try {
        e?.preventDefault?.();

        const value = inputRef.current?.value;
        setLoading(true);

        controller.abort();

        if (value) {
          const searchResults = await TwitchAPI.getSearchChannels(
            { first: limit, after: page, signal: controller.signal },
            value
          );

          setResult((c) => {
            const res = searchResults?.data?.data?.map((i) => ({
              ...i,
              login: i.broadcaster_login,
              profile_image_url: i.thumbnail_url,
            }));

            if (page) return [...c, ...res];

            return res;
          });
          setPage(searchResults?.data?.pagination?.cursor);
        }
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
    if (e.key === 'ArrowDown') {
      if (showDropdown) e.preventDefault();
      setShowDropdown(true);
      const selected = listRef.current?.querySelector?.('.selected');
      if (!selected && listRef.current) {
        const firstItem = listRef.current.querySelector('.item');
        if (firstItem) firstItem.classList.add('selected');
        return;
      }
      const next = selected?.nextSibling;

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
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
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
  };

  useEventListenerMemo(
    'keydown',
    handleArrowNavigation,
    ref.current,
    ref.current === document.activeElement || inputRef.current === document.activeElement
  );

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
      inputRef.current.value = value || '';
    }
  };

  const onChange = (e) => {
    setPage(null);
    handleSearch(e);
    props?.onChange?.(e.target.value?.trimStart?.());
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSubmit(e);
    }
  };

  const onFocus = async () => {
    setShowDropdown(true);
    setLoading(true);

    const channels = await getMyFollowedChannels();
    const channelsWithProfiles = await addVideoExtraData({
      items: {
        data: channels?.map((i) => ({ ...i, user_id: i.to_id, login: i.to_login || i.to_name })),
      },
      fetchGameInfo: false,
      fetchProfiles: true,
    });

    setFollowedChannels(
      channelsWithProfiles?.data?.map((i) => ({
        ...i,
        login: loginNameFormat(i, true),
        id: i.to_id,
        user_id: i.to_id,
        following: true,
      }))
    );
    setLoading(false);
  };

  // useEffect(() => {
  //   setItems(
  //     getUniqueListBy(
  //       [
  //         ...(followedChannels?.filter((i) =>
  //           loginNameFormat(i)?.includes(inputRef.current.value)
  //         ) || []),
  //         ...(result || []),
  //       ],
  //       'id'
  //     )
  //   );
  // }, [followedChannels, result]);

  // const onBlur = () => {
  //   //FIX, fires when clicking on buttons
  //   setShowDropdown(false);
  // };

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = props.value || '';
  }, [props.value]);

  const loadmore = () => {
    return handleSearch();
  };

  const items = getUniqueListBy(
    [
      ...(followedChannels || [])?.filter((i) =>
        loginNameFormat(i)
          ?.toLowerCase()
          ?.includes(inputRef.current?.value?.trim?.()?.toLowerCase())
      ),
      ...(result || []),
      // .sort(
      //   (a, b) =>
      //     loginNameFormat(a).replace(inputRef.current?.value?.trim?.())?.length -
      //     loginNameFormat(b).replace(inputRef.current?.value?.trim?.())?.length
      // ),
    ],
    'id'
  );

  return (
    <Wrapper
      ref={ref}
      tabIndex={1}
      style={props.style}
      onTransitionEnd={() => {
        setRnd((c) => !c);
      }}
      // onBlur={onBlur}
      open={showDropdown}
    >
      <InputWrapper>
        <Input
          ref={inputRef}
          onChange={onChange}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
          placeholder={placeholder || 'Channel..'}
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
            {loading ? 'Loading..' : `Total: ${items?.length}`}
          </div>
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
                hideExtraButtons={hideExtraButtons}
                onSelect={props.onChange}
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

export default ChannelSearchBar;
