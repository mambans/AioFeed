import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import React, { useRef } from "react";

import {
	VideoContainer,
	VideoTitle,
	ImageContainer,
	GameContainer,
	ChannelContainer,
	ImgBottomInfo,
} from "./../../sharedComponents/sharedStyledComponents";
import { truncate } from "../../../utilities";
import { formatViewerNumbers } from "./../TwitchUtils";
import loginNameFormat from "../loginNameFormat";
import ToolTip from "../../../components/tooltip/ToolTip";

const ClipElement = ({ ...data }) => {
	const { user_name } = data;
	const { broadcaster_id, id, thumbnail_url, view_count, title, profile_image_url, game_name, game_img, created_at } = data.data;
	const imgRef = useRef();

	return (
		<VideoContainer>
			<ImageContainer ref={imgRef}>
				<a className="imgLink" href={`https://www.twitch.tv/${loginNameFormat({ ...data?.data, user_name }, true)}/clip/${id}`}>
					{thumbnail_url && <img src={thumbnail_url} alt="" />}
				</a>
				<ImgBottomInfo>
					<span className={"vodDuration"} title="duration" />
					<span className={"view_count"} title="views">
						{formatViewerNumbers(view_count)}
						<FaRegEye size={10} />
					</span>
				</ImgBottomInfo>
			</ImageContainer>
			<ToolTip show={title?.length > 50} tooltip={title || ""}>
				<VideoTitle to={`/${loginNameFormat({ ...data?.data, user_name }, true)}/clip/${id}`}>{truncate(title || "", 70)}</VideoTitle>
			</ToolTip>
			<div style={{ width: "336px" }}>
				<ChannelContainer>
					<Link
						className={"profileImg"}
						to={{
							pathname: `/${loginNameFormat({ ...data?.data, user_name }, true)?.toLowerCase()}/page`,
							state: {
								p_id: broadcaster_id,
							},
						}}
					>
						<img src={profile_image_url} alt="" />
					</Link>
					<Link to={`/${loginNameFormat({ ...data?.data, user_name }, true)?.toLowerCase()}/page`} className="channelName">
						{loginNameFormat({ ...data?.data, user_name })}
					</Link>
				</ChannelContainer>
				<GameContainer>
					<a className={"gameImg"} href={"https://www.twitch.tv/directory/category/" + game_name}>
						<img src={game_img?.replace("{width}", 130)?.replace("{height}", 173)} alt="" className={"gameImg"} />
					</a>
					<Link className={"gameName"} to={"/category/" + game_name}>
						{game_name}
					</Link>
					<Moment
						className="viewers"
						style={{
							gridColumn: 3,
							justifySelf: "right",
						}}
						fromNow
					>
						{created_at}
					</Moment>
				</GameContainer>
			</div>
		</VideoContainer>
	);
};
export default ClipElement;
