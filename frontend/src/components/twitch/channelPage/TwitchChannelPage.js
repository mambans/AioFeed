import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useCallback, useState, useRef } from "react";

import { StyledLoadmore } from "./../styledComponents";
import { SubFeedContainer } from "./../../sharedStyledComponents";
import LoadingBoxs from "./../LoadingBoxs";
import LoadingPlaceholderBanner from "./LoadingPlaceholderBanner";
import LoadingPlaceholderClips from "./LoadingPlaceholderClips";
import LoadingPlaceholderVods from "./LoadingPlaceholderVods";
import SortButton from "./SortButton";
import TwitchClipElement from "./TwitchClipElement";
import TwitchVodElement from "../vods/TwitchVodElement";
import Utilities from "./../../../utilities/Utilities";
import {
  ChannelContainer,
  Banner,
  Name,
  BannerInfoOverlay,
  SubFeedHeader,
  LiveIndicator,
  LiveIndicatorIcon,
} from "./StyledComponents";

export default () => {
  const { id } = useParams();
  const [channelInfo, setChannelInfo] = useState();
  const [vods, setVods] = useState();
  const [clips, setClips] = useState();
  const [vodsloadmoreLoaded, setVodsLoadmoreLoaded] = useState(true);
  const [clipsloadmoreLoaded, setClipsLoadmoreLoaded] = useState(true);
  const [sortVodsBy, setSortVodsBy] = useState("time");
  const [live, setLive] = useState();

  const numberOfVideos = Math.floor(document.documentElement.clientWidth / 350);
  const userName = useRef();
  const vodPagination = useRef();
  const previosVodPage = useRef();
  const previosClipsPage = useRef();
  const clipPagination = useRef();
  const loadmoreVodsRef = useRef();
  const loadmoreClipsRef = useRef();

  const getIdFromName = useCallback(async () => {
    return await axios
      .get(`https://api.twitch.tv/helix/users`, {
        params: {
          login: id,
        },
        headers: {
          Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .then(res => {
        return res.data.data[0].id;
      });
  }, [id]);

  const fetchChannelInfo = useCallback(async UserId => {
    return await axios
      .get(`https://api.twitch.tv/kraken/channels/${UserId}`, {
        headers: {
          Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          Accept: "application/vnd.twitchtv.v5+json",
        },
      })
      .then(res => {
        return res.data;
      });
  }, []);

  const fetchChannelVods = useCallback(
    async (UserId, pagination) => {
      if (pagination) {
        setVodsLoadmoreLoaded(false);
      } else {
        setVods();
        previosVodPage.current = null;
      }

      await axios
        .get(`https://api.twitch.tv/helix/videos?`, {
          params: {
            user_id: UserId,
            first: numberOfVideos,
            sort: sortVodsBy,
            type: "all",
            after: pagination || null,
          },
          headers: {
            Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          },
        })
        .then(res => {
          vodPagination.current = res.data.pagination.cursor;

          if (pagination) {
            const vodsWithEndDate = res.data.data.map(stream => {
              if (stream.type === "archive") {
                stream.endDate = Utilities.durationToMs(stream.duration, stream.published_at);
              } else {
                stream.endDate = new Date(stream.published_at);
              }
              return stream;
            });

            const allVods = previosVodPage.current.concat(vodsWithEndDate);
            previosVodPage.current = allVods;

            setVodsLoadmoreLoaded(true);
            setVods(allVods);

            setTimeout(() => {
              if (loadmoreVodsRef.current) {
                loadmoreVodsRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                  inline: "nearest",
                });
              }
            }, 0);
          } else {
            const vodsWithEndDate = res.data.data.map(stream => {
              if (stream.type === "archive") {
                stream.endDate = Utilities.durationToMs(stream.duration, stream.published_at);
              } else {
                stream.endDate = new Date(stream.published_at);
              }
              return stream;
            });

            previosVodPage.current = vodsWithEndDate;
            setVods(vodsWithEndDate);
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    [numberOfVideos, sortVodsBy]
  );

  const fetchClips = useCallback(
    async (UserId, pagination) => {
      if (pagination) setClipsLoadmoreLoaded(false);

      await axios
        .get(`https://api.twitch.tv/helix/clips`, {
          params: {
            broadcaster_id: UserId,
            first: numberOfVideos,
            after: pagination || null,
          },
          headers: {
            Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          },
        })
        .then(res => {
          clipPagination.current = res.data.pagination.cursor;

          if (pagination) {
            const allClips = previosClipsPage.current.concat(res.data.data);
            previosClipsPage.current = allClips;
            setClipsLoadmoreLoaded(true);
            setClips(allClips);

            setTimeout(() => {
              if (loadmoreClipsRef.current) {
                loadmoreClipsRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                  inline: "nearest",
                });
              }
            }, 0);
          } else {
            previosClipsPage.current = res.data.data;
            setClips(res.data.data);
          }
        });
    },
    [numberOfVideos]
  );

  useEffect(() => {
    const getChannelInfo = async () => {
      userName.current = await getIdFromName();
      const ChannelInfo = await fetchChannelInfo(userName.current);

      document.title = `${ChannelInfo.display_name} | Notifies`;

      setChannelInfo(ChannelInfo);
      await fetchChannelVods(userName.current);
      await fetchClips(userName.current);
    };

    const checkIfLive = async () => {
      await axios
        .get(`https://api.twitch.tv/helix/streams`, {
          params: {
            user_login: id,
          },
          headers: {
            Authorization: `Bearer ${Utilities.getCookie("Twitch-access_token")}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          },
        })
        .then(res => {
          if (res.data.data.length > 0) setLive(true);
        });
    };

    getChannelInfo();
    checkIfLive();
  }, [getIdFromName, fetchChannelInfo, fetchChannelVods, fetchClips, id]);

  return (
    <ChannelContainer>
      {channelInfo ? (
        <Banner>
          <img id='Banner' alt='' src={channelInfo.profile_banner} />
          <BannerInfoOverlay>
            <Name>
              <div id='HeaderChannelInfo'>
                <div id='ChannelName'>
                  {live ? (
                    <Nav.Link as={NavLink} to={`/twitch/live/${id}`} style={{ padding: "0" }}>
                      <LiveIndicator>
                        <LiveIndicatorIcon />
                        <p>Live</p>
                      </LiveIndicator>
                    </Nav.Link>
                  ) : null}
                  <Nav.Link as={NavLink} to={`/twitch/live/${id}`} id='ChannelLiveLink'>
                    <img id='profileIcon' alt='' src={channelInfo.logo} />
                    {channelInfo.display_name}
                  </Nav.Link>
                  {channelInfo.partner ? (
                    <img
                      id='partnered'
                      title='Partnered'
                      alt=''
                      src={`${process.env.PUBLIC_URL}/partnered.png`}
                    />
                  ) : null}
                </div>
                <p id='title'>{channelInfo.status}</p>
                <p id='game'>{channelInfo.game}</p>
                <p id='desc'>{channelInfo.description}</p>
                <div style={{ display: "flex", justifyContent: "center", color: "#cacaca" }}>
                  <p style={{ marginRight: "50px" }}>Followers: {channelInfo.followers}</p>
                  <p>Views: {channelInfo.views}</p>
                </div>
                <p id='updated'>
                  Updated: {moment(channelInfo.updated_at).format("YYYY/MM/DD HH:MM")}
                </p>
              </div>
            </Name>
          </BannerInfoOverlay>
        </Banner>
      ) : (
        <LoadingPlaceholderBanner />
      )}
      {vods ? (
        <>
          <SubFeedHeader
            style={{
              margin: "50px auto 10px auto",
              borderBottom: "1px solid grey",
              width: `${numberOfVideos * 350}px`,
            }}>
            <SortButton sortBy={sortVodsBy} setSortBy={setSortVodsBy} />
            <h3>Vods</h3>
          </SubFeedHeader>
          <SubFeedContainer
            style={{ justifyContent: "center", minHeight: "345px", paddingBottom: "0" }}>
            {vods ? (
              <TransitionGroup className='twitch-vods' component={null}>
                {vods.map(vod => {
                  return (
                    <CSSTransition key={vod.id} timeout={1000} classNames='fade-1s' unmountOnExit>
                      <TwitchVodElement data={vod} transition='fade-1s' />
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>
            ) : (
              <LoadingBoxs amount={numberOfVideos} />
            )}
          </SubFeedContainer>
          <StyledLoadmore
            ref={loadmoreVodsRef}
            style={{
              width: `${numberOfVideos * 350}px`,
              margin: "auto",
            }}>
            <div />
            <p
              onClick={() => {
                fetchChannelVods(userName.current, vodPagination.current);
              }}>
              {!vodsloadmoreLoaded ? (
                <>
                  Loading..
                  <Spinner
                    animation='border'
                    role='status'
                    variant='light'
                    style={{ ...Utilities.loadingSpinnerSmall, marginLeft: "10px" }}
                  />
                </>
              ) : (
                "Load more"
              )}
            </p>
            <div />
          </StyledLoadmore>
        </>
      ) : (
        <LoadingPlaceholderVods numberOfVideos={numberOfVideos} />
      )}
      {clips ? (
        <>
          <SubFeedHeader
            style={{
              margin: "50px auto 10px auto",
              borderBottom: "1px solid grey",
              width: `${numberOfVideos * 350}px`,
            }}>
            <h3>Popular clips</h3>
          </SubFeedHeader>

          <SubFeedContainer
            style={{ justifyContent: "center", minHeight: "310px", paddingBottom: "0" }}>
            {clips ? (
              <TransitionGroup className='twitch-vods' component={null}>
                {clips.map(clip => {
                  return (
                    <CSSTransition key={clip.id} timeout={1000} classNames='fade-1s' unmountOnExit>
                      <TwitchClipElement
                        data={clip}
                        user_name={channelInfo.name}
                        transition='fade-1s'
                      />
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>
            ) : (
              <LoadingBoxs amount={numberOfVideos} />
            )}
          </SubFeedContainer>
          <StyledLoadmore
            ref={loadmoreClipsRef}
            style={{
              width: `${numberOfVideos * 350}px`,
              margin: "auto",
            }}>
            <div />
            <p
              onClick={() => {
                fetchClips(userName.current, clipPagination.current);
              }}>
              {!clipsloadmoreLoaded ? (
                <>
                  Loading..
                  <Spinner
                    animation='border'
                    role='status'
                    variant='light'
                    style={{ ...Utilities.loadingSpinnerSmall, marginLeft: "10px" }}
                  />
                </>
              ) : (
                "Load more"
              )}
            </p>
            <div />
          </StyledLoadmore>
        </>
      ) : (
        <LoadingPlaceholderClips numberOfVideos={numberOfVideos} />
      )}
    </ChannelContainer>
  );
};
