import React, { useContext } from "react";
import styled, { css } from "styled-components";
import MyListsContext from "../myLists/MyListsContext";
import ToolTip from "../../components/tooltip/ToolTip";
import { useFeedSections } from "../../stores/twitch/feedSections";
import { useFeedPreferences, useUpdateFeedPreference } from "../../stores/feedPreference";

const SliderMultipuleHandles = styled.div`
	position: absolute;
	right: ${({ right, sliderLength }) => sliderLength / 2 - 20}px;
	top: ${({ top, sliderLength }) => sliderLength / 2 + 50}px;
`;

const style = css`
	cursor: pointer;
	border: none;
	box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; /* Add cool effects to your sliders! */
	pointer-events: all;
	width: 25px;
	height: 25px;
	opacity: 0.5;
	transform: rotate(-90deg);
	transition: opacity 250ms, filter 250ms;
	border-radius: 0;

	&:hover {
		opacity: 1;
		filter: brightness(200%);
	}
`;

const StyledSliderThumb = styled.input.attrs({ type: "range", min: 1, max: 1000 })`
	transform: rotate(90deg);
	width: ${({ sliderLength }) => sliderLength}px;
	position: absolute;
	color: transparent !important;
	-webkit-appearance: none;
	background: transparent;
	pointer-events: none;
	transform: width 500ms;

	&:first-of-type {
		background: rgba(67, 71, 74, 0.3);
		border-radius: 15px;
		height: 10px;
	}

	&::-webkit-slider-thumb {
		-webkit-appearance: none;
	}

	&::-ms-track {
		width: 100%;
		cursor: pointer;

		/* Hides the slider so custom styles can be added */
		background: transparent;
		border-color: transparent;
		color: transparent;
	}
	/* Chrome */
	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		${style}
		background: ${({ icon }) => icon || "#ffffff"};
		background-size: contain;
		background-repeat: no-repeat;

		margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
	}

	/* Firefox */
	&::-moz-range-thumb {
		${style}
		background: ${({ icon }) => icon || "#ffffff"};
		background-size: contain;
		background-repeat: no-repeat;
	}

	/* IE */
	&::-ms-thumb {
		${style}
		background: ${({ icon }) => icon || "#ffffff"};
		background-size: contain;
		background-repeat: no-repeat;
	}
`;

const SliderThumb = ({ name, id, icon, sliderLength }) => {
	const updatePreference = useUpdateFeedPreference();
	const feedPreferences = useFeedPreferences();

	const ID = id || name;

	const handleSubmit = (e) => {
		updatePreference(ID, { order: parseInt(e.target.value) });
	};

	return (
		<ToolTip
			tooltip={name + " @" + (feedPreferences?.[ID]?.order || 500)}
			placement="left"
			style={{
				top: (feedPreferences?.[ID]?.order - 500) * (sliderLength / 2 / 500) + "px",
				right: "20px",
			}}
		>
			<StyledSliderThumb icon={icon} onMouseUp={handleSubmit} defaultValue={feedPreferences?.[ID]?.order || 500} sliderLength={sliderLength} />
		</ToolTip>
	);
};

const FeedOrderSlider = () => {
	const { lists } = useContext(MyListsContext);
	const feedSections = useFeedSections();

	const feedPreferences = useFeedPreferences();

	const feeds = [
		feedPreferences?.twitch?.enabled && {
			name: "twitch",
			id: "twitch",
			icon: `url(${process.env.PUBLIC_URL}/twitch-icon.svg)`,
		},
		feedPreferences?.youtube?.enabled && {
			name: "youtube",
			id: "youtube",
			icon: `url(${process.env.PUBLIC_URL}/youtube-icon.svg)`,
		},
		feedPreferences?.vods?.enabled && {
			name: "vods",
			id: "vods",
			icon: `url(${process.env.PUBLIC_URL}/vods-icon.svg)`,
		},
		feedPreferences?.mylists?.enabled &&
			lists &&
			Object.values(lists)
				.filter((l) => l.enabled)
				.map((list) => ({
					name: list.title,
					id: list.id,
					icon: `url(${process.env.PUBLIC_URL}/list-icon.svg)`,
				})),
		feedPreferences?.feedSections?.enabled &&
			feedSections &&
			Object.values(feedSections)
				.filter((feed) => feed.enabled)
				.map((feed) => ({
					name: feed.title,
					id: feed.id,
					icon: `url(${process.env.PUBLIC_URL}/feedSection-icon.svg)`,
				})),
	]
		.flat(1)
		.filter((i) => i);

	if (!feeds.length || feeds.length <= 1) return null;

	return (
		<SliderMultipuleHandles sliderLength={feeds?.length * 75}>
			<div style={{ position: "relative" }}>
				{feeds.map(({ name, id, icon = `url(${process.env.PUBLIC_URL}/list-icon.svg)` }, index) => {
					return <SliderThumb key={id || index} name={name} icon={icon} id={id} sliderLength={feeds?.length * 75} />;
				})}
			</div>
		</SliderMultipuleHandles>
	);
};

export default FeedOrderSlider;
