import { MdFavorite } from "react-icons/md";
import { MdChat } from "react-icons/md";
import { FaWindowClose } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useEffect, useCallback, useState, useRef, useContext } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import Moment from "react-moment";

import AccountContext from "./../../account/AccountContext";
import LoadingPlaceholderBanner from "./LoadingPlaceholderBanner";
import LoadingPlaceholderClips from "./LoadingPlaceholderClips";
import LoadingPlaceholderVods from "./LoadingPlaceholderVods";
import SubFeed from "./SubFeed";
import UnfollowStream from "./../UnfollowStream";
import Utilities from "./../../../utilities/Utilities";
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
} from "./StyledComponents";

export default () => {
  const { id } = useParams();
  document.title = `N | ${id}'s Channel`;
  const { p_channelInfos, p_uptime, p_viewers, p_id, p_logo } = useLocation().state || {};
  const [channelInfo, setChannelInfo] = useState(p_channelInfos);
  const numberOfVideos = Math.floor(document.documentElement.clientWidth / 350);

  const [vods, setVods] = useState();
  const [clips, setClips] = useState();
  const [vodsloadmoreLoaded, setVodsLoadmoreLoaded] = useState(true);
  const [clipsloadmoreLoaded, setClipsLoadmoreLoaded] = useState(true);
  const [sortVodsBy, setSortVodsBy] = useState("Time");
  const [sortClipsBy, setSortClipsBy] = useState(null);
  const [following, setFollowing] = useState(false);
  const [channelId, setChannelId] = useState(p_id);
  const [isLive, setIsLive] = useState();
  const [viewers, setViewers] = useState(p_viewers);
  const [uptime, setUptime] = useState(p_uptime);
  const [videoOpen, setVideoOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);

  const vodPagination = useRef();
  const previosVodPage = useRef();
  const previosClipsPage = useRef();
  const clipPagination = useRef();
  const loadmoreVodsRef = useRef();
  const loadmoreClipsRef = useRef();
  const twitchPlayer = useRef();
  const viewersTimer = useRef();
  const refetchUptimeTimer = useRef();

  const { setTwitchToken, twitchToken, setRefreshToken, refreshToken, twitchUserId } = useContext(
    AccountContext
  );

  const getIdFromName = useCallback(async () => {
    await axios
      .get(`https://api.twitch.tv/helix/users`, {
        params: {
          login: id,
        },
        headers: {
          Authorization: `Bearer ${twitchToken}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .then(res => {
        setChannelId(res.data.data[0].id);
      })
      .catch(error => {
        console.error("GetIdFromName: ", error);
      });
  }, [id, twitchToken]);

  const fetchChannelInfo = useCallback(async () => {
    if (p_channelInfos) {
      return p_channelInfos;
    } else {
      return await axios
        .get(`https://api.twitch.tv/kraken/channels/${channelId}`, {
          headers: {
            Authorization: `OAuth ${twitchToken}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
            Accept: "application/vnd.twitchtv.v5+json",
          },
        })
        .then(res => {
          return res.data;
        })
        .catch(error => {
          console.error("fetchChannelInfo: ", error);
        });
    }
  }, [twitchToken, channelId, p_channelInfos]);

  const followStream = async UserId => {
    await axios
      .put(`https://api.twitch.tv/kraken/users/${twitchUserId}/follows/channels/${UserId}`, "", {
        headers: {
          Authorization: `OAuth ${twitchToken}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
          Accept: "application/vnd.twitchtv.v5+json",
        },
      })
      .then(res => {
        if (res.data) console.log("Started following", channelInfo.display_name);
      })
      .catch(async error => {
        console.log(`Failed to unfollow ${channelInfo.display_name}. `, error);
        console.log(`Trying to auto re-authenticate with Twitch.`);

        await axios
          .post(
            `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURI(
              refreshToken
            )}&client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&client_secret=${
              process.env.REACT_APP_TWITCH_SECRET
            }&scope=channel:read:subscriptions+user:edit+user:read:broadcast+user_follows_edit&response_type=code`
          )
          .then(async res => {
            setTwitchToken(res.data.access_token);
            setRefreshToken(res.data.refresh_token);
            document.cookie = `Twitch-access_token=${res.data.access_token}; path=/`;
            document.cookie = `Twitch-refresh_token=${res.data.refresh_token}; path=/`;

            await axios
              .put(
                `https://api.twitch.tv/kraken/users/${twitchUserId}/follows/channels/${UserId}`,
                "",
                {
                  headers: {
                    Authorization: `OAuth ${res.data.access_token}`,
                    "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                    Accept: "application/vnd.twitchtv.v5+json",
                  },
                }
              )
              .then(() => {
                console.log(`Followed: ${channelInfo.display_name}`);
                // data.refresh();
              })
              .catch(error => {
                console.error("Followed: ", error);
              });
          })
          .catch(er => {
            console.error(er);
            console.log(`Failed to follow stream ${channelInfo.display_name}: `, er);
            console.log("::Try manually re-authenticate from the sidebar.::");
          });
      });
  };

  const fetchChannelVods = useCallback(
    async pagination => {
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
            Authorization: `Bearer ${twitchToken}`,
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
    [numberOfVideos, sortVodsBy, channelId, twitchToken]
  );

  const fetchClips = useCallback(
    async pagination => {
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
            Authorization: `Bearer ${twitchToken}`,
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
        })
        .catch(error => {
          console.error("fetchClips: ", error);
        });
    },
    [numberOfVideos, sortClipsBy, channelId, twitchToken]
  );

  const getChannelInfo = useCallback(async () => {
    const CheckIfFollowed = async UserId => {
      await axios
        .get(`https://api.twitch.tv/kraken/users/${twitchUserId}/follows/channels/${UserId}`, {
          headers: {
            Authorization: `OAuth ${twitchToken}`,
            "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
            Accept: "application/vnd.twitchtv.v5+json",
          },
        })
        .then(res => {
          setFollowing(true);
        })
        .catch(error => {
          if (
            error.response &&
            error.response.status === 404 &&
            error.response.statusText === "Not Found"
          ) {
            console.log(`Not following ${UserId}`);
            setFollowing(false);
          } else {
            console.error(error);
          }
        });
    };

    const ChannelInfos = await fetchChannelInfo();

    if (!channelInfo) setChannelInfo(ChannelInfos);
    CheckIfFollowed(ChannelInfos._id);
  }, [fetchChannelInfo, twitchUserId, twitchToken, channelInfo]);

  const fetchUptime = useCallback(async () => {
    await axios
      .get(`https://api.twitch.tv/helix/streams`, {
        params: {
          user_id: twitchPlayer.current.getChannelId(),
          first: 1,
        },
        headers: {
          Authorization: `Bearer ${twitchToken}`,
          "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
        },
      })
      .then(res => {
        if (res.data.data[0] && res.data.data[0].started_at) {
          setUptime(res.data.data[0].started_at);
        } else {
          refetchUptimeTimer.current = setTimeout(async () => {
            await axios
              .get(`https://api.twitch.tv/helix/streams`, {
                params: {
                  user_id: twitchPlayer.current.getChannelId(),
                  first: 1,
                },
                headers: {
                  Authorization: `Bearer ${twitchToken}`,
                  "Client-ID": process.env.REACT_APP_TWITCH_CLIENT_ID,
                },
              })
              .then(res => {
                if (res.data.data[0] && res.data.data[0].started_at) {
                  setUptime(res.data.data[0].started_at);
                } else {
                }
              });
          }, 60000);
        }
      })
      .catch(error => {
        console.log("fetchChannelInfo stream: error", error);
      });
  }, [twitchToken]);

  useEffect(() => {
    (async () => {
      if (!channelId) await getIdFromName();
      if (!channelInfo && channelId) getChannelInfo();
    })();

    return () => {
      clearInterval(viewersTimer.current);
    };
  }, [channelInfo, getChannelInfo, getIdFromName, channelId]);

  const OnlineEvents = useCallback(() => {
    console.log("Stream is Online");
    setIsLive(true);

    setViewers(twitchPlayer.current.getViewers());
    if (!uptime) {
      setTimeout(() => {
        fetchUptime();
      }, 5000);
    }

    if (!viewersTimer.current) {
      viewersTimer.current = setInterval(() => {
        setViewers(twitchPlayer.current.getViewers());
      }, 1000 * 60 * 2);
    }
  }, [fetchUptime, uptime]);

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
    if (channelId && !vods) {
      fetchChannelVods();
    }
  }, [fetchChannelVods, vods, channelId]);

  useEffect(() => {
    if (channelId && !clips) {
      fetchClips();
    }
  }, [fetchClips, clips, channelId]);

  useEffect(() => {
    return () => {
      clearTimeout(refetchUptimeTimer.current);
      clearInterval(viewersTimer.current);
    };
  });

  return (
    <ChannelContainer>
      <VideoPlayer id='twitch-embed' style={{ display: videoOpen ? "block" : "none" }} />
      <Chat
        frameborder='0'
        scrolling='yes'
        theme='dark'
        // id={id + "-chat"}
        src={`https://www.twitch.tv/embed/${id}/chat?darkpopout`}
        style={{ display: chatOpen ? "block" : "none" }}
      />
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
          size={20}
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
          <img id='Banner' alt='' src={channelInfo.profile_banner} />
          <BannerInfoOverlay>
            <Name>
              <div id='HeaderChannelInfo'>
                <div id='ChannelName'>
                  {isLive ? (
                    <StyledLiveInfoContainer>
                      <div id='LiveDetails'>
                        <span>Viewers: {viewers}</span>
                        <span>Uptime: {<Moment durationFromNow>{uptime}</Moment>}</span>
                      </div>
                      <Link
                        to={{
                          pathname: `/live/${id}`,
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
                  ) : null}
                  <Link
                    to={{
                      pathname: `/live/${id}`,
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
                  {channelInfo.partner ? (
                    <img
                      id='partnered'
                      title='Partnered'
                      alt=''
                      src={`${process.env.PUBLIC_URL}/partnered.png`}
                    />
                  ) : null}

                  {following ? (
                    <OverlayTrigger
                      key={"bottom"}
                      placement={"bottom"}
                      delay={{ show: 500, hide: 0 }}
                      overlay={
                        <Tooltip id={`tooltip-${"bottom"}`}>
                          Unfollow <strong>{channelInfo.display_name}</strong>.
                        </Tooltip>
                      }>
                      <MdFavorite
                        size={30}
                        // id='FollowUnfollowButton'
                        id='IsFollowed'
                        onClick={() => {
                          setFollowing(false);
                          UnfollowStream({
                            user_id: channelInfo._id,
                            setTwitchToken: setTwitchToken,
                            twitchToken: twitchToken,
                            setRefreshToken: setRefreshToken,
                          }).catch(error => {
                            console.log(
                              `Failed to unfollow stream ${channelInfo.display_name}: `,
                              error
                            );
                            console.log("::Try re-authenticate from the sidebar::");
                          });
                        }}
                      />
                    </OverlayTrigger>
                  ) : (
                    <OverlayTrigger
                      key={"bottom"}
                      placement={"bottom"}
                      delay={{ show: 500, hide: 0 }}
                      overlay={
                        <Tooltip id={`tooltip-${"bottom"}`}>
                          Follow <strong>{channelInfo.display_name}</strong>.
                        </Tooltip>
                      }>
                      <MdFavoriteBorder
                        size={30}
                        id='IsNotFollowed'
                        onClick={() => {
                          setFollowing(true);
                          followStream(channelInfo._id);
                        }}
                      />
                    </OverlayTrigger>
                  )}
                </div>
                <p id='title'>{channelInfo.status}</p>
                <Link to={`/game/${channelInfo.game}`} id='game'>
                  {channelInfo.game}
                </Link>
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
  );
};
