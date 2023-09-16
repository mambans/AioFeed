import { CSSTransition, TransitionGroup } from "react-transition-group";
import React, { useContext } from "react";
import { MdStar } from "react-icons/md";

import StreamElement from "./StreamElement.jsx";
import { Container, FavoriteDeviderLine } from "../StyledComponents";
import LoadingBoxes from "../LoadingBoxes";
import { CenterContext } from "../../feed/FeedsCenterContainer.jsx";
import { TwitchContext } from "../useToken.jsx";
import Alert from "../../../components/alert/index.jsx";

const Twitch = ({ data, streams, hideOnEmpty }) => {
	const { loading, error } = data;
	const { videoElementsAmount, feedVideoSizeProps } = useContext(CenterContext);
	const { favStreams } = useContext(TwitchContext);

	const { favoriteStreams, nonFavoriteStreams } =
		streams?.reduce(
			(acc, stream) => {
				if (favStreams?.includes?.(stream?.user_id)) {
					return { ...acc, favoriteStreams: [...acc.favoriteStreams, stream] };
				}
				return { ...acc, nonFavoriteStreams: [...acc.nonFavoriteStreams, stream] };
			},
			{ favoriteStreams: [], nonFavoriteStreams: [] }
		) || {};

	const refresh = async () => await data?.refresh();

	if (loading && !streams?.length) {
		return (
			<Container>
				<LoadingBoxes amount={videoElementsAmount || 4} type="big" />
			</Container>
		);
	} else if (error) {
		return <Alert type="secondary" fill title={error} />;
	}

	const streamEleAttrs = {
		refresh,
	};

	const cssTransitionAttrs = {
		timeout: 750,
		unmountOnExit: true,
		appear: true,
	};

	return (
		<Container style={{ margin: "0" }}>
			<TransitionGroup component={null}>
				{favoriteStreams?.map((stream) => (
					<CSSTransition key={stream.user_id} classNames={feedVideoSizeProps.transition || "videoFadeSlide"} {...cssTransitionAttrs}>
						<StreamElement key={stream.id} data={stream} newlyAdded={stream.newlyAdded} {...streamEleAttrs} />
					</CSSTransition>
				))}
			</TransitionGroup>
			{Boolean(favoriteStreams?.length) && (
				<FavoriteDeviderLine feedVideoSizeProps={feedVideoSizeProps}>
					<div />
					<MdStar size={16} color={"#bcbc1d"} />
					<div />
				</FavoriteDeviderLine>
			)}
			<TransitionGroup component={null}>
				{nonFavoriteStreams?.map((stream) => (
					<CSSTransition key={stream.user_id} classNames={feedVideoSizeProps.transition || "videoFadeSlide"} {...cssTransitionAttrs}>
						<StreamElement key={stream.id} data={stream} newlyAdded={stream.newlyAdded} {...streamEleAttrs} />
					</CSSTransition>
				))}
			</TransitionGroup>
		</Container>
	);
};
export default Twitch;
