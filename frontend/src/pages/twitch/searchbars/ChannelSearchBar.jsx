import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, InputWrapper, SearchBarSuffixButton, Wrapper } from "./styledComponents";
import debounce from "lodash/debounce";
import TwitchAPI, { pagination } from "../API";
import useEventListenerMemo from "../../../hooks/useEventListenerMemo";
import addVideoExtraData from "../AddVideoExtraData";
import loginNameFormat from "../loginNameFormat";
import { chunk, getUniqueListBy } from "../../../util";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
// import useClicksOutside from '../../../hooks/useClicksOutside';
import API from "../../navigation/API";
import ChannelSearchBarList from "./ChannelSearchBarList";

const SearchSubmitIcon = styled(FaSearch).attrs({ size: 18 })``;
//
const ChannelSearchBar = ({ searchButton = true, position, placeholder, hideExtraButtons, wrap = true, open = false, ...props }) => {
	// const [showDropdown, setShowDropdown] = useState();
	const [result, setResult] = useState();
	const [page, setPage] = useState();
	const [loading, setLoading] = useState();
	const [search, setSearch] = useState("");
	/* eslint-disable no-unused-vars */
	const [rnd, setRnd] = useState(true);
	/* eslint-enable no-unused-vars */
	const [followedChannels, setFollowedChannels] = useState([]);
	const [vodChannels, setVodChannels] = useState([]);
	const navigate = useNavigate();
	const location = useLocation();
	const ref = useRef();
	const inputRef = useRef();
	const listRef = useRef();
	const previousSearch = useRef();
	const controller = new AbortController();
	const limit = 25;

	// useClicksOutside(ref.current, () => setShowDropdown(false), showDropdown);

	const handleSearch = debounce(
		async (e, query = inputRef.current?.value, page) => {
			console.log("handleSearch:");
			try {
				e?.preventDefault?.();
				setLoading(true);
				controller.abort();

				if (query) {
					if (query !== previousSearch.current || page) {
						const searchResults = await TwitchAPI.getSearchChannels({ first: limit, after: page, signal: controller.signal }, query);

						setResult((c) => {
							const res = searchResults?.data?.data?.map((i) => ({
								...i,
								login: i.broadcaster_login,
								profile_image_url: i.thumbnail_url,
								user_id: i.id,
							}));

							if (page) return [...c, ...res];

							return res;
						});
						previousSearch.current = query;
						if (searchResults?.data?.data?.length > limit) setPage(searchResults?.data?.pagination?.cursor);
					}
				} else {
					setResult([]);
					previousSearch.current = query;
				}
				setLoading(false);
			} catch (error) {
				console.log("error:", error);
				setLoading(false);
			}
		},
		500,
		{ leading: false, trailing: true, maxWait: 3000 }
	);

	const scrollItemIntoView = (item) => {
		item?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
	};

	const handleArrowNavigation = (e) => {
		if (e.key === "ArrowDown") {
			// if (showDropdown) e.preventDefault();
			// setShowDropdown(true);
			const selected = listRef.current?.querySelector?.(".selected");
			if (!selected && listRef.current) {
				const firstItem = listRef.current.querySelector(".item");
				if (firstItem) {
					firstItem.classList.add("selected");
					inputRef.current.value = firstItem.textContent;
					if (props.onChange) {
						props.onChange?.(firstItem.textContent);
					}
				}
				return;
			}
			const next = selected?.nextSibling;

			if (next && !next.classList.contains("loading") && next.classList.contains("item")) {
				selected.classList.remove("selected");
				next.classList.add("selected");
				inputRef.current.value = next.textContent;
				if (props.onChange) {
					props.onChange?.(next.textContent);
				}
				//fires onChange and searching which I dpnt want (block onChange?)
				scrollItemIntoView(next);
			}
			return;
		}
		if (e.key === "ArrowUp") {
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			// if (showDropdown) e.preventDefault();

			const selected = listRef.current?.querySelector?.(".selected");
			const previous = selected?.previousSibling;

			if (previous && !previous.classList.contains("loading") && !previous.classList.contains("total")) {
				selected.classList.remove("selected");
				previous.classList.add("selected");
				inputRef.current.value = previous.textContent;
				if (props.onChange) {
					props.onChange?.(previous.textContent);
				}
				//fires onChange and searching which I dpnt want (block onChange?)
				scrollItemIntoView(previous);
			} else if (inputRef.current) {
				selected?.classList?.remove("selected");
				inputRef.current.focus();
			}
			return;
		}
	};

	useEventListenerMemo(
		"keydown",
		handleArrowNavigation,
		ref.current,
		ref.current === document.activeElement || inputRef.current === document.activeElement
	);

	const onSubmit = (event) => {
		const selected = listRef.current?.querySelector?.(".selected");
		const elementTitle = selected?.querySelector?.(".title");
		const value = (elementTitle?.textContent || search).trimStart();

		try {
			if (elementTitle) {
				event.preventDefault?.();
			}
			if (props.onSubmit && inputRef.current !== document.activeElement) {
				props.onSubmit?.(value);
				return;
			}
			if (props.onChange) {
				props.onChange?.(value);
				return;
			}

			if (location.pathname === "/feed") {
				window.open(`/${value}`);
			} else {
				navigate(`/${value}`);
			}
		} catch (error) {
		} finally {
			// setShowDropdown(false);
			inputRef.current?.blur?.();
			setSearch(value || "");
		}
	};

	// useEffect(() => {
	//   handleSearch(null, search?.trimStart?.());
	// }, [search]);

	const onKeyPress = (e) => {
		if (e.key === "Enter") {
			onSubmit(e);
		}
	};

	const onBlur = () => {
		inputRef.current.value = "";
	};

	const onFocus = async (e) => {
		// setShowDropdown(true);
		// setLoading(true);

		setTimeout(async () => {
			//replace these context or atoms?? but then the whole searchbar will rerender when adding vod channels
			const channels = await pagination(await TwitchAPI.getMyFollowedChannels({ first: 100 }));

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
			const vodChannelIds = await API.getVodChannels();
			const vodChannels = (
				await Promise.allSettled(
					chunk(vodChannelIds, 100).map(async (ids) => {
						const response = await TwitchAPI.getUser({ id: ids, first: 100 });
						return response?.data?.data;
					})
				)
			).flatMap((promise) => promise.value || []);

			const vodUsers = vodChannels
				.filter((u) => u)
				.map((user) => {
					return { ...user, user_id: user.id };
				});
			setVodChannels(vodUsers);

			if (e.target.value?.trimStart?.()) handleSearch(e, e.target.value?.trimStart?.());

			setLoading(false);
		}, 0);
	};

	useEffect(() => {
		if (inputRef.current) inputRef.current.value = props.value || "";
	}, [props.value]);

	const loadmore = () => {
		console.log("loadmore:");
		return handleSearch(null, inputRef.current.value?.trimStart?.(), page);
	};

	const items = useMemo(() => {
		const followedItemsIds = followedChannels.map((i) => i.id);
		return getUniqueListBy(
			[
				...(followedChannels?.filter(
					(i) =>
						// new RegExp(inputRef.current?.value?.trim?.()?.toLowerCase(), 'i').test(loginNameFormat(i))
						!inputRef.current.value?.trimStart?.() ||
						loginNameFormat(i)?.toLowerCase()?.includes(inputRef.current.value?.trimStart?.()?.trim?.()?.toLowerCase())
				) || []),
				...(vodChannels?.filter(
					(i) =>
						// new RegExp(inputRef.current?.value?.trim?.()?.toLowerCase(), 'i').test(loginNameFormat(i))
						!inputRef.current.value?.trimStart?.() ||
						loginNameFormat(i)?.toLowerCase()?.includes(inputRef.current.value?.trimStart?.()?.trim?.()?.toLowerCase())
				) || []),
				// ...(result || []),
				...(result
					// .filter(
					//   (i) =>
					//     search && loginNameFormat(i)?.toLowerCase()?.includes(search?.trim?.()?.toLowerCase())
					// )
					?.sort((a, b) => followedItemsIds.includes(b.id))
					?.map((cha) => followedChannels?.find((channel) => String(channel.id) === String(cha.id)) || cha)
					?.sort(
						(a, b) =>
							loginNameFormat(a).replace(inputRef.current?.value?.trim?.())?.length -
							loginNameFormat(b).replace(inputRef.current?.value?.trim?.())?.length
					) || []),
			],
			"id"
		);
		/* eslint-disable  */
	}, [followedChannels, result, vodChannels]);
	/* eslint-enable  */

	const onChange = (e) => {
		setTimeout(() => {
			setPage(null);
			setSearch(e.target.value?.trimStart?.());
			setTimeout(() => {
				handleSearch(null, e.target.value?.trimStart?.());
				props?.onChange?.(e.target.value?.trimStart?.());
			}, 0);
		}, 0);
	};

	return (
		<Wrapper
			ref={ref}
			tabIndex={1}
			open={open}
			style={props.style}
			onTransitionEnd={() => setRnd((c) => !c)}
			// onBlur={onBlur}
			// open={showDropdown}
			wrap={wrap}
		>
			<InputWrapper>
				<Input
					ref={inputRef}
					// value={search}
					onChange={onChange}
					onKeyPress={onKeyPress}
					onFocus={onFocus}
					onBlur={onBlur}
					placeholder={placeholder || "Channel.."}
				/>
				{searchButton && (
					<SearchBarSuffixButton onClick={onSubmit} disabled={inputRef.current !== document.activeElement || !search?.trim?.()}>
						<SearchSubmitIcon />
					</SearchBarSuffixButton>
				)}
			</InputWrapper>
			{/* {inputRef.current === document.activeElement && ( */}
			<ChannelSearchBarList
				ref={listRef}
				listRef={listRef}
				items={items}
				search={search}
				position={position}
				hideExtraButtons={hideExtraButtons}
				onSelect={props.onChange}
				page={page}
				loading={loading}
				result={result}
				limit={limit}
				loadmore={loadmore}
				rnd={rnd}
				wrap={wrap}
			/>
		</Wrapper>
	);
};

export default ChannelSearchBar;
