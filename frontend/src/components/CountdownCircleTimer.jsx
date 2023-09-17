import moment from "moment";
import { StyledCountdownCircle } from "./styledComponents";
import React, { useState, useEffect } from "react";

const CountdownCircleTimer = ({ isLoading, nextRefresh, style = {}, size = 24 }) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [rerender, setRerender] = useState();
	const interval = React.useRef();

	useEffect(() => {
		if (nextRefresh) {
			clearInterval(interval.current);
			interval.current = setInterval(() => {
				setRerender(Date.now());
			}, 1000);
		}

		return () => {
			clearInterval(interval.current);
		};
	}, [nextRefresh]);

	const duration = moment.duration(moment(nextRefresh).diff(moment()));
	const seconds = duration.asSeconds();

	return (
		<StyledCountdownCircle isLoading={isLoading} style={style} size={size}>
			{nextRefresh && !isLoading && <div id="countdown-number">{seconds > 0 ? Math.ceil(seconds) : 0}</div>}
			<svg>
				<circle r={size / 2 - 2} cx={size / 2} cy={size / 2}></circle>
			</svg>
		</StyledCountdownCircle>
	);
};

export default CountdownCircleTimer;
