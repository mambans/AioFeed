import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useRef } from "react";
import Tooltip from "react-bootstrap/Tooltip";

import {
  VideoContainer,
  VideoTitle,
  ImageContainer,
  GameContainer,
  ChannelContainer,
  VodVideoInfo,
} from "./../../sharedStyledComponents";
import Util from "../../../util/Util";

export default ({ ...data }) => {
  const imgRef = useRef();

  return (
    <VideoContainer>
      <ImageContainer ref={imgRef}>
        <a
          // href={data.data.embed_url}
          href={`https://www.twitch.tv/${data.user_name || data.data.broadcaster_name}/clip/${
            data.data.id
          }`}>
          <img src={data.data.thumbnail_url} alt='' />
        </a>
        <VodVideoInfo>
          <p className={"vodDuration"} title='duration'></p>
          <p className={"view_count"} title='views'>
            {Util.formatViewerNumbers(data.data.view_count)}
            <FaRegEye
              size={10}
              style={{
                color: "rgb(200, 200, 200)",
                marginLeft: "5px",
                marginTop: "3px",
                display: "flex",
                alignItems: "center",
              }}
            />
          </p>
        </VodVideoInfo>
      </ImageContainer>
      {data.data.title.length > 50 ? (
        <OverlayTrigger
          key={"bottom"}
          placement={"bottom"}
          delay={{ show: 250, hide: 0 }}
          overlay={
            <Tooltip
              id={`tooltip-${"bottom"}`}
              style={{
                width: "320px",
              }}>
              {data.data.title}
            </Tooltip>
          }>
          <VideoTitle to={`/${data.user_name || data.data.broadcaster_name}/clip/${data.data.id}`}>
            {Util.truncate(data.data.title, 70)}
          </VideoTitle>
        </OverlayTrigger>
      ) : (
        <VideoTitle to={`/${data.user_name || data.data.broadcaster_name}/clip/${data.data.id}`}>
          {data.data.title}
        </VideoTitle>
      )}

      <div style={{ width: "336px" }}>
        <ChannelContainer>
          <Link
            to={{
              pathname: `/${data.data.broadcaster_name.toLowerCase()}/channel`,
              state: {
                p_id: data.data.broadcaster_id,
              },
            }}
            style={{ gridRow: 1, paddingRight: "5px" }}>
            <img src={data.data.profile_img_url} alt='' className={"profileImg"} />
          </Link>
          <Link to={`/${data.data.broadcaster_name.toLowerCase()}/channel`} className='channelName'>
            {data.data.broadcaster_name}
          </Link>
        </ChannelContainer>
        <GameContainer>
          <a
            className={"gameImg"}
            href={"https://www.twitch.tv/directory/category/" + data.data.game_name}>
            <img
              src={data.data.game_img.replace("{width}", 130).replace("{height}", 173)}
              alt=''
              className={"gameImg"}
            />
          </a>
          <Link className={"gameName"} to={"/category/" + data.data.game_name}>
            {data.data.game_name}
          </Link>
          <Moment
            className='viewers'
            style={{
              color: "var(--VideoContainerLinks)",
              gridColumn: 3,
              justifySelf: "right",
            }}
            fromNow>
            {data.data.created_at}
          </Moment>
        </GameContainer>
      </div>
    </VideoContainer>
  );
};
