import React from "react";

import { LoadingVideoElement } from "./StyledComponents";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const LoadingBoxes = ({ amount = 3, type, load = true, freeze }) => {
	const array = [...Array(Math.floor(Math.max(typeof amount === "number" ? amount || 0 : 1, 1)))];

	if (load) {
		return (
			<TransitionGroup component={null}>
				{array.map((v, index) => (
					<CSSTransition key={index} timeout={250} classNames="fade-250ms" unmountOnExit>
						<LoadingVideoElement type={type} freeze={freeze} />
					</CSSTransition>
				))}
			</TransitionGroup>
		);
	}
	return null;
};
export default LoadingBoxes;
