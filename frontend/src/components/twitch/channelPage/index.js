import { MdChat } from "react-icons/md";
import { FaWindowClose } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useCallback, useState, useRef } from "react";
import Moment from "react-moment";

import LoadingPlaceholderBanner from "./LoadingPlaceholderBanner";
import LoadingPlaceholderClips from "./LoadingPlaceholderClips";
import LoadingPlaceholderVods from "./LoadingPlaceholderVods";
import SubFeed from "./SubFeed";
import Util from "./../../../util/Util";
import {
  ChannelContainer,
  Banner,
  Name,
  BannerInfoOverlay,
  LiveIndicator,
  LiveIndicatorIcon,
  VideoPlayer,
  Chat,
  StyledLiveInfoContainer,
  BlurredBannerImage,
} from "./StyledComponents";
import FollowUnfollowBtn from "./../FollowUnfollowBtn";
import AddVideoExtraData from "../AddVideoExtraData";
import fetchUptime from "./../player/fetchUptime";
import fetchAndSetChannelInfo from "./../player/fetchAndSetChannelInfo";
import setFavion from "../../setFavion";
import { Alert } from "react-bootstrap";

export default () => {
  const { id } = useParams();
  const { p_channelInfos, p_uptime, p_viewers, p_id, p_logo } = useLocation().state || {};
  const [channelInfo, setChannelInfo] = useState(p_channelInfos);
  const numberOfVideos = Math.floor(document.documentElement.clientWidth / 350);

  const [vods, setVods] = useState();
  const [clips, setClips] = useState();
  const [vodsloadmoreLoaded, setVodsLoadmoreLoaded] = useState(true);
  const [clipsloadmoreLoaded, setClipsLoadmoreLoaded] = useState(true);
  const [sortVodsBy, setSortVodsBy] = useState("Time");
  const [sortClipsBy, setSortClipsBy] = useState(null);
  const [channelId, setChannelId] = useState(p_id);
  const [isLive, setIsLive] = useState();
  const [viewers, setViewers] = useState(p_viewers);
  const [uptime, setUptime] = useState(p_uptime);
  const [videoOpen, setVideoOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const vodPagination = useRef();
  const previosVodPage = useRef();
  const previosClipsPage = useRef();
  const clipPagination = useRef();
  const loadmoreVodsRef = useRef();
  const loadmoreClipsRef = useRef();
  const twitchPlayer = useRef();
  const viewersTimer = useRef();
  const uptimeTimer = useRef();

  const getIdFromName = useCallback(async () => {
    await axios
      .get(`https://api.twitch.tv/helix/users`, {
        params: {
          login: id,
        },
        headers: {
          Authorization: `Bearer ${Util.getCookie("Twitch-access_token")}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .then((res) => {
        setChannelId(res.data.data[0].id);
      })
      .catch((error) => {
        console.error(error);
        // if (error.message === `can't access property "id", res.data.data[0] is undefined`) {
        setChannelId("Not Found");
        // }
      });
  }, [id]);

  const fetchChannelVods = useCallback(
    async (pagination) => {
      if (pagination) {
        setVodsLoadmoreLoaded(false);
      } else {
        previosVodPage.current = null;
      }

      await axios
        .get(`https://api.twitch.tv/helix/videos?`, {
          params: {
            user_id: channelId,
            first: numberOfVideos,
            sort: sortVodsBy && sortVodsBy.toLowerCase(),
            type: "all",
            after: pagination || null,
          },
          headers: {
            Authorization: `Bearer ${Util.getCookie("Twitch-access_token")}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          },
        })
        .then(async (res) => {
          if (res.data.data.length === 0) {
            setVods({ error: "No vods available" });
            return "";
          }
          vodPagination.current = res.data.pagination.cursor;

          const videos = await AddVideoExtraData(res, false);

          if (pagination) {
            const finallVideos = videos.data.map((stream) => {
              if (stream.type === "archive") {
                stream.endDate = Util.durationToDate(stream.duration, stream.published_at);
              } else {
                stream.endDate = new Date(stream.published_at);
              }
              return stream;
            });

            const allVods = previosVodPage.current.concat(finallVideos);
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
            const finallVideos = await videos.data.map((stream) => {
              if (stream.type === "archive") {
                stream.endDate = Util.durationToDate(stream.duration, stream.published_at);
              } else {
                stream.endDate = new Date(stream.published_at);
              }
              return stream;
            });

            previosVodPage.current = finallVideos;

            setVods(finallVideos);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    [numberOfVideos, sortVodsBy, channelId]
  );

  const fetchClips = useCallback(
    async (pagination) => {
      if (pagination) {
        setClipsLoadmoreLoaded(false);
      } else {
        previosClipsPage.current = null;
      }

      await axios
        .get(`https://api.twitch.tv/helix/clips`, {
          params: {
            broadcaster_id: channelId,
            first: numberOfVideos,
            after: pagination || null,
            started_at:
              sortClipsBy &&
              new Date(new Date().setDate(new Date().getDate() - sortClipsBy)).toISOString(),
            ended_at: sortClipsBy && new Date().toISOString(),
          },
          headers: {
            Authorization: `Bearer ${Util.getCookie("Twitch-access_token")}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          },
        })
        .then(async (res) => {
          if (res.data.data.length === 0) {
            setClips({ error: "No clips available" });
            return "";
          }
          clipPagination.current = res.data.pagination.cursor;
          const finallClips = await AddVideoExtraData(res);

          if (pagination) {
            const allClips = previosClipsPage.current.concat(finallClips.data);
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
            previosClipsPage.current = finallClips.data;
            setClips(finallClips.data);
          }
        })
        .catch((error) => {
          console.error("fetchClips: ", error);
        });
    },
    [numberOfVideos, sortClipsBy, channelId]
  );

  const getChannelInfo = useCallback(async () => {
    if (!channelInfo) await fetchAndSetChannelInfo(channelId, setChannelInfo);
  }, [channelInfo, channelId]);

  useEffect(() => {
    document.title = `AF | ${id}'s Channel`;
  }, [id]);

  useEffect(() => {
    (async () => {
      if (!channelId) await getIdFromName();
      if (!channelInfo && channelId && channelId !== "Not Found") getChannelInfo();
    })();

    return () => {
      clearInterval(viewersTimer.current);
    };
  }, [channelInfo, getChannelInfo, getIdFromName, channelId]);

  const OnlineEvents = useCallback(() => {
    console.log("Stream is Online");
    document.title = `AF | ${id}'s Channel (Live)`;

    setIsLive(true);

    setViewers(twitchPlayer.current.getViewers());
    if (!uptime) {
      setTimeout(() => {
        fetchUptime(twitchPlayer, setUptime, uptimeTimer);
      }, 5000);
    }

    if (!viewersTimer.current) {
      viewersTimer.current = setInterval(() => {
        setViewers(twitchPlayer.current.getViewers());
      }, 1000 * 60 * 2);
    }
  }, [uptime, id]);

  const offlineEvents = () => {
    console.log("Stream is Offline");
    setIsLive(false);
    clearInterval(viewersTimer.current);
  };

  useEffect(() => {
    try {
      if (!twitchPlayer.current) {
        twitchPlayer.current = new window.Twitch.Player("twitch-embed", {
          width: `${300 * 1.777777777777778}px`,
          height: "300px",
          theme: "dark",
          layout: "video",
          channel: id,
          muted: true,
        });
      }

      if (twitchPlayer.current) {
        twitchPlayer.current.addEventListener(window.Twitch.Player.ONLINE, OnlineEvents);
        twitchPlayer.current.addEventListener(window.Twitch.Player.OFFLINE, offlineEvents);
      }

      return () => {
        twitchPlayer.current.removeEventListener(window.Twitch.Player.ONLINE, OnlineEvents);
        twitchPlayer.current.removeEventListener(window.Twitch.Player.OFFLINE, offlineEvents);
      };
    } catch (error) {
      console.log("error", error);
    }
  }, [id, OnlineEvents]);

  useEffect(() => {
    if (channelId && !vods && channelId !== "Not Found") {
      fetchChannelVods();
    }
  }, [fetchChannelVods, vods, channelId]);

  useEffect(() => {
    if (channelId && !clips && channelId !== "Not Found") {
      fetchClips();
    }
  }, [fetchClips, clips, channelId]);

  useEffect(() => {
    if (channelInfo) {
      setFavion(channelInfo.logo);
      // document.documentElement.style.setProperty(
      //   "--backgroundImg",
      //   `url(${channelInfo.profile_banner})`
      // );
    }
  }, [channelInfo]);

  useEffect(() => {
    const uptTimer = uptimeTimer.current;

    return () => {
      clearTimeout(uptTimer);
      clearInterval(viewersTimer.current);
    };
  }, []);

  if (channelId === "Not Found") {
    return (
      <ChannelContainer>
        <Banner>
          <div id='Banner' alt='' style={{ backgroundColor: "var(--navigationbarBackground)" }} />
          <BannerInfoOverlay>
            <Name>
              <div id='HeaderChannelInfo' style={{ height: "80%" }}>
                <div id='ChannelName'>
                  <p id='ChannelLiveLink'>
                    <img id='profileIcon' alt='' src={"asd"} />
                    {id}
                  </p>
                </div>
                <p id='title'>Channel Not Found!</p>
              </div>
            </Name>
          </BannerInfoOverlay>
        </Banner>
        {/* <LoadingPlaceholderVods numberOfVideos={numberOfVideos} />
        <LoadingPlaceholderClips numberOfVideos={numberOfVideos} /> */}
      </ChannelContainer>
    );
  } else {
    return (
      <>
        {/* {channelInfo && <BlurredBackgroundImage image={channelInfo.profile_banner} />} */}
        <ChannelContainer>
          <VideoPlayer id='twitch-embed' style={{ display: videoOpen ? "block" : "none" }} />
          {chatOpen && (
            <Chat
              frameborder='0'
              scrolling='yes'
              theme='dark'
              // id={id + "-chat"}
              src={`https://www.twitch.tv/embed/${id}/chat?darkpopout`}
              // style={{ display: chatOpen ? "block" : "none" }}
            />
          )}
          {videoOpen ? (
            <FaWindowClose
              title='Close video'
              className='svgButton'
              id='closeVideo'
              size={20}
              onClick={() => {
                setVideoOpen(!videoOpen);
              }}
            />
          ) : (
            <MdLiveTv
              title='Open video'
              className='svgButton'
              id='openVideo'
              size={30}
              onClick={() => {
                setVideoOpen(!videoOpen);
              }}
            />
          )}
          {chatOpen ? (
            <FaWindowClose
              title='Close chat'
              className='svgButton'
              id='closeChat'
              size={20}
              onClick={() => {
                setChatOpen(!chatOpen);
              }}
            />
          ) : (
            <MdChat
              title='Open chat'
              className='svgButton'
              id='openChat'
              size={20}
              onClick={() => {
                setChatOpen(!chatOpen);
              }}
            />
          )}
          {channelInfo ? (
            <Banner>
              {/* <img id='Banner' alt='' src={channelInfo.profile_banner} /> */}
              <BannerInfoOverlay>
                <Name>
                  {channelInfo && <BlurredBannerImage image={channelInfo.profile_banner} />}

                  <div id='HeaderChannelInfo'>
                    <div id='ChannelName'>
                      {isLive && (
                        <StyledLiveInfoContainer
                          to={{
                            pathname: `/${id}`,
                            state: {
                              p_channelInfos: channelInfo,
                              p_viewers: viewers,
                              p_uptime: uptime,
                            },
                          }}>
                          <div id='LiveDetails'>
                            <span>Viewers: {Util.formatViewerNumbers(viewers)}</span>
                            <span>Uptime: {<Moment durationFromNow>{uptime}</Moment>}</span>
                          </div>
                          <Link
                            to={{
                              pathname: `/${id}`,
                              state: {
                                p_channelInfos: channelInfo,
                                p_viewers: viewers,
                                p_uptime: uptime,
                              },
                            }}
                            style={{ padding: "0 15px" }}>
                            <LiveIndicator>
                              <LiveIndicatorIcon />
                              <p>Live</p>
                            </LiveIndicator>
                          </Link>
                        </StyledLiveInfoContainer>
                      )}
                      <Link
                        to={{
                          pathname: `/${id}`,
                          state: {
                            p_channelInfos: channelInfo,
                            p_viewers: viewers,
                            p_uptime: uptime,
                          },
                        }}
                        id='ChannelLiveLink'>
                        <img id='profileIcon' alt='' src={channelInfo.logo || p_logo} />
                        {channelInfo.display_name}
                      </Link>
                      {channelInfo.partner && (
                        <img
                          id='partnered'
                          title='Partnered'
                          alt=''
                          src={`${process.env.PUBLIC_URL}/partnered.png`}
                        />
                      )}
                      {channelInfo && <FollowUnfollowBtn channelName={id} id={channelInfo._id} />}
                    </div>
                    <p id='title'>{channelInfo.status}</p>
                    <Link to={`/game/${channelInfo.game}`} id='game'>
                      {channelInfo.game}
                    </Link>
                    <p id='desc'>{channelInfo.description}</p>
                    <div id='followViews'>
                      <p>Followers: {channelInfo.followers}</p>
                      <p>Views: {channelInfo.views}</p>
                    </div>
                    <p id='updated'>
                      Updated: {moment(channelInfo.updated_at).format("YYYY/MM/DD HH:mm")}
                    </p>
                  </div>
                </Name>
              </BannerInfoOverlay>
            </Banner>
          ) : (
            <LoadingPlaceholderBanner />
          )}
          {vods ? (
            <SubFeed
              feedName='Vods'
              items={vods}
              sortBy={sortVodsBy}
              setSortBy={setSortVodsBy}
              setSortData={setVods}
              loadmoreRef={loadmoreVodsRef.current}
              fetchItems={fetchChannelVods}
              itemPagination={vodPagination}
              itemsloadmoreLoaded={vodsloadmoreLoaded}
            />
          ) : (
            <LoadingPlaceholderVods numberOfVideos={numberOfVideos} />
          )}
          {clips ? (
            <SubFeed
              feedName='Clips'
              items={clips}
              sortBy={sortClipsBy}
              setSortBy={setSortClipsBy}
              setSortData={setClips}
              loadmoreRef={loadmoreClipsRef.current}
              fetchItems={fetchClips}
              itemPagination={clipPagination}
              itemsloadmoreLoaded={clipsloadmoreLoaded}
              channelInfo={channelInfo}
            />
          ) : (
            <LoadingPlaceholderClips numberOfVideos={numberOfVideos} />
          )}
        </ChannelContainer>
      </>
    );
  }
};
