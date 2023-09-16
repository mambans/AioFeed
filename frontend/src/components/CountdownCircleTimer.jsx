import moment from "moment";
import { StyledCountdownCircle } from "./styledComponents";
import React, { useState, useEffect } from "react";

const CountdownCircleTimer = ({ isLoading, nextRefresh, style = {}, size = 24 }) => {
	const [countdown, setCountdown] = useState();

	useEffect(() => {
		if (nextRefresh) {
			const duration = moment.duration(moment(nextRefresh).diff(moment()));
			const seconds = duration.asSeconds();

			setCountdown(seconds);

			setInterval(() => {
				const duration = moment.duration(moment(nextRefresh).diff(moment()));
				const seconds = duration.asSeconds();

				setCountdown(seconds);
			}, 1000);
		}
	}, [nextRefresh]);

	console.log("isLoading:", isLoading);
	return (
		<StyledCountdownCircle isLoading={isLoading} style={style} size={size}>
			{nextRefresh && !isLoading && <div id="countdown-number">{countdown > 0 ? Math.ceil(countdown) : 0}</div>}
			<svg>
				<circle r={size / 2 - 2} cx={size / 2} cy={size / 2}></circle>
			</svg>
		</StyledCountdownCircle>
	);
};

export default CountdownCircleTimer;
