import React, { useState, useMemo } from "react";
import debounce from "lodash/debounce";

import { StyledFeedSizeSlider } from "../StyledComponents";
import { useFeedPreferences } from "../../../stores/feedPreference";
import { useFeedVideoSize, useSetFeedVideoSize } from "../../../stores/feedVideoSize";

const FeedSizeSlider = () => {
	const feedPreferences = useFeedPreferences();
	const { twitch, vods, youtube, mylists } = feedPreferences || {};

	const feedSize = useFeedVideoSize();
	const setFeedSize = useSetFeedVideoSize();
	const [sizeValue, setSizeValue] = useState(feedSize);

	const delayedHandleChange = useMemo(() => debounce((v) => setFeedSize(v), 250, { maxWait: 500 }), [setFeedSize]);

	const handleChange = (v) => {
		setSizeValue(v.target.value);
		delayedHandleChange(v.target.value);
	};

	if (twitch?.enabled || vods?.enabled || youtube?.enabled || mylists?.enabled) {
		return (
			<StyledFeedSizeSlider>
				{`Feed video size: ${sizeValue}`}
				<input defaultValue={sizeValue} onChange={handleChange} type="range" className="form-range" min="30" max="100" />
			</StyledFeedSizeSlider>
		);
	}
	return null;
};

export default FeedSizeSlider;
