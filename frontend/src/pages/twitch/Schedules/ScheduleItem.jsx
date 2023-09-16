import moment from "moment";
import React from "react";
import { FaRegClock } from "react-icons/fa";
import Moment from "react-moment";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import ToolTip from "../../../components/tooltip/ToolTip";
import LiveIndicator from "../LiveIndicator";
import useStreamsStore from "../../../stores/twitch/streams/useStreamsStore";
import { useFeedVideoSizeObject } from "../../../stores/feedVideoSize";

const ScheduleItem = ({ user, category, start_time, end_time, title }) => {
	const { id: gameId, name, box_art_url } = category || {};
	const { profile_image_url, login, user_name, id } = user || {};
	const feedVideoSizeProps = useFeedVideoSizeObject();
	const location = useLocation();

	const isPassed = moment(start_time).isBefore(moment());
	const liveStreams = useStreamsStore((state) => state.livestreams);
	const liveStream = liveStreams.find((stream) => stream.user_id === id) || true;
	console.log("liveStream:", liveStream);

	const datePrefix = (() => {
		if (end_time && moment(end_time).isBefore(moment())) return "Ended ";
		if (start_time && moment(start_time).isBefore(moment())) return "Started ";
		return "Starting ";
	})();
	return (
		<Wrapper feedPreferences={feedPreferences} ispassed={isPassed} to={`/${login}`} target={(location?.pathname === "/feed" && "_blank") || null}>
			<Profile src={profile_image_url} />
			<InnerWrapper>
				<div>
					<NameWrapper target={(location?.pathname === "/feed" && "_blank") || null} to={`/${login}`}>
						<Name target={(location?.pathname === "/feed" && "_blank") || null} to={`/${login}`}>
							{login}{" "}
						</Name>
						{liveStream && <LiveIndicator>{/* <HeartBeat scale={1.35} /> */}</LiveIndicator>}
					</NameWrapper>
					<p>{title}</p>
				</div>
				<div>
					<GameWrapper target={(location?.pathname === "/feed" && "_blank") || null} to={`/category/${name}`}>
						<GameImage src={box_art_url?.replace("{width}", 144)?.replace("{height}", 192)} />
						<GameName>{name}</GameName>
					</GameWrapper>
					<ToolTip
						tooltip={
							<>
								{start_time && (
									<p>
										Starting at:{" "}
										<Moment format="YYYY-MM-DD h:mm" utc local className="start">
											{start_time}
										</Moment>
									</p>
								)}
								{end_time && (
									<p>
										Ending at:{" "}
										<Moment format="YYYY-MM-DD h:mm" utc local className="end">
											{end_time}
										</Moment>
									</p>
								)}

								<p>
									Duration:{" "}
									<Moment diff={start_time} unit="hours">
										{end_time}
									</Moment>
									hours
								</p>
							</>
						}
					>
						<DateWrapper>
							<span>
								{datePrefix}
								<StartingIn fromNow>{start_time}</StartingIn>
							</span>

							{end_time && (
								<div>
									<FaRegClock size={12} style={{ marginRight: "5px" }} />
									<Moment diff={start_time} unit="hours">
										{end_time}
									</Moment>
									h
								</div>
							)}
						</DateWrapper>
					</ToolTip>
				</div>
			</InnerWrapper>
		</Wrapper>
	);
};
export default ScheduleItem;

// {
//   id: 'eyJzZWdtZW50SUQiOiJlYTI0OGQxYi00YjEyLTQ3YTctOWFkNS0xZjdkMGU5ZmZkNTIiLCJpc29ZZWFyIjoyMDIyLCJpc29XZWVrIjo1MX0=',
//   start_time: '2022-12-25T15:30:00Z',
//   end_time: '2022-12-25T19:30:00Z',
//   title: 'ASMR',
//   canceled_until: null,
//   category: {
//     id: '509659',
//     name: 'ASMR',
//     box_art_url: 'https://static-cdn.jtvnw.net/ttv-boxart/509659-{width}x{height}.jpg',
//   },
//   is_recurring: true,
//   user: {
//     from_id: '32540540',
//     from_login: 'mambans',
//     from_name: 'Mambans',
//     to_id: '160349660',
//     to_login: 'quuut3842',
//     to_name: '큐우티',
//     followed_at: '2022-09-06T16:09:30Z',
//     profile_image_url:
//       'https://static-cdn.jtvnw.net/jtv_user_pictures/336de0e9-5b81-454f-b42c-fb956fe63ae6-profile_image-300x300.png',
//     login: 'quuut3842',
//     user_name: 'quuut3842',
//     id: '160349660',
//   },
// },

const Wrapper = styled(Link)`
	height: 150px;
	display: flex;
	gap: 1rem;
	padding: 1rem;
	box-shadow: var(--videoBoxShadow);
	border-radius: 1em;
	background-color: var(--videoContainerBackgroundColor);
	width: max-content;
	transition: opacity 250ms, scale 250ms;
	opacity: ${({ isPassed }) => (isPassed ? 0.35 : 1)};
	width: 400px;
	font-size: ${({ feedPreferences: { fontSize } }) => fontSize || 16}px;
	height: ${({ feedPreferences: { height } }) => height * 0.5 || 200}px;
	margin: ${({ feedPreferences: { margin } }) => margin}px;

	* {
		color: var(--textColor1);
	}

	a:hover {
		color: var(--textColor1);
	}

	&:hover {
		opacity: 1;
		z-index: 2;
		scale: 1.15;
	}
`;
const InnerWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	justify-content: space-between;
	flex: 1;
	/* overflow: hidden; */
`;
const Profile = styled.img`
	height: 100%;
	border-radius: 0.5rem;
`;
const NameWrapper = styled(Link)`
	position: relative;
	width: max-content;
	/* text-overflow: ellipsis;
  overflow: hidden; */
`;
const Name = styled.span`
	font-weight: 700;
	font-size: 1.1em;

	/* text-overflow: ellipsis;
  overflow: hidden; */
`;
const GameWrapper = styled(Link)`
	display: flex;
	gap: 1rem;
	align-items: center;
`;
const GameName = styled.p`
	margin: 0;
	font-size: 0.9em;
`;
const GameImage = styled.img`
	height: 45px;
`;

const StartingIn = styled(Moment)``;

const DateWrapper = styled.div`
	display: flex;
	justify-content: space-between;
`;
