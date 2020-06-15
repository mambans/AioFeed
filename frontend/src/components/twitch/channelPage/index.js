import { MdChat } from "react-icons/md";
import { FaWindowClose } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import { useParams, useLocation, Link } from "react-router-dom";
import moment from "moment";
import React, { useEffect, useCallback, useState, useRef, useContext } from "react";
import Moment from "react-moment";

import LoadingPlaceholderBanner from "./LoadingPlaceholderBanner";
import LoadingPlaceholderClips from "./LoadingPlaceholderClips";
import LoadingPlaceholderVods from "./LoadingPlaceholderVods";
import SubFeed from "./SubFeed";
import { durationToDate } from "./../TwitchUtils";
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
  VideoChatButton,
} from "./StyledComponents";
import FollowUnfollowBtn from "./../FollowUnfollowBtn";
import AddVideoExtraData from "../AddVideoExtraData";
import fetchStreamInfo from "./../player/fetchStreamInfo";
import fetchChannelInfo from "./../player/fetchChannelInfo";
import setFavion from "../../setFavion";
import validateToken from "../validateToken";
import AddUpdateNotificationsButton from "../AddUpdateNotificationsButton";
import API from "./../API";
import AnimatedViewCount from "../live/AnimatedViewCount";
import { getCookie } from "../../../util/Utils";
import disconnectTwitch from "../disconnectTwitch";
import AccountContext from "../../account/AccountContext";
import FeedsContext from "../../feed/FeedsContext";
import ReAuthenticateButton from "../../navigation/sidebar/ReAuthenticateButton";

export default () => {
  const { channelName } = useParams();
  const { p_channelInfos, p_id, p_logo } = useLocation().state || {};
  const [channelInfo, setChannelInfo] = useState(p_channelInfos);
  const [streamInfo, setStreamInfo] = useState(p_channelInfos);
  const numberOfVideos = Math.floor(document.documentElement.clientWidth / 350);
  const { setTwitchToken, twitchToken } = useContext(AccountContext);
  const { setEnableTwitch } = useContext(FeedsContext);

  const [vods, setVods] = useState();
  const [clips, setClips] = useState();
  const [vodsloadmoreLoaded, setVodsLoadmoreLoaded] = useState(true);
  const [clipsloadmoreLoaded, setClipsLoadmoreLoaded] = useState(true);
  const [sortVodsBy, setSortVodsBy] = useState("Time");
  const [sortClipsBy, setSortClipsBy] = useState(null);
  const [channelId, setChannelId] = useState(p_id);
  const [isLive, setIsLive] = useState();
  const [videoOpen, setVideoOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const vodPagination = useRef();
  const previosVodPage = useRef();
  const previosClipsPage = useRef();
  const clipPagination = useRef();
  const loadmoreVodsRef = useRef();
  const loadmoreClipsRef = useRef();
  const twitchPlayer = useRef();

  const getIdFromName = useCallback(async () => {
    await API.getUser({
      params: {
        login: channelName,
      },
      throwError: false,
    })
      .then((res) => {
        setChannelId(res.data.data[0].id);
      })
      .catch((error) => {
        setChannelId("Not Found");
      });
  }, [channelName]);

  const fetchChannelVods = useCallback(
    async (pagination) => {
      await validateToken().then(async () => {
        if (pagination) {
          setVodsLoadmoreLoaded(false);
        } else {
          previosVodPage.current = null;
        }

        await API.getVideos({
          params: {
            user_id: channelId,
            first: numberOfVideos,
            sort: sortVodsBy && sortVodsBy.toLowerCase(),
            type: "all",
            after: pagination || null,
          },
        })
          .then(async (res) => {
            if (res.data.data.length === 0 && (!vods || !Array.isArray(vods) || vods.length < 1)) {
              setVods({ error: "No vods available" });
              return "";
            }

            if (res.data.data.length === 0 && (vods || Array.isArray(vods) || vods.length > 1)) {
              setVodsLoadmoreLoaded(true);
              return "";
            }
            vodPagination.current = res.data.pagination.cursor;

            const videos = await AddVideoExtraData({ items: res.data, fetchGameInfo: false });
            const finallVideos = await videos.data.map((stream) => {
              if (stream.type === "archive") {
                stream.endDate = durationToDate(stream.duration, stream.published_at);
              } else {
                stream.endDate = new Date(stream.published_at).getTime();
              }
              return stream;
            });

            if (pagination) {
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
              previosVodPage.current = finallVideos;

              setVods(finallVideos);
            }
          })
          .catch((e) => {
            console.error(e);
          });
      });
    },
    [numberOfVideos, sortVodsBy, channelId, vods]
  );

  const fetchClips = useCallback(
    async (pagination) => {
      await validateToken().then(async () => {
        if (pagination) {
          setClipsLoadmoreLoaded(false);
        } else {
          previosClipsPage.current = null;
        }

        await API.getClips({
          params: {
            broadcaster_id: channelId,
            first: numberOfVideos,
            after: pagination || null,
            started_at:
              sortClipsBy &&
              new Date(new Date().setDate(new Date().getDate() - sortClipsBy)).toISOString(),
            ended_at: sortClipsBy && new Date().toISOString(),
          },
        })
          .then(async (res) => {
            if (
              res.data.data.length === 0 &&
              (!clips || !Array.isArray(clips) || clips.length < 1)
            ) {
              setClips({ error: "No clips available" });
              return "";
            }

            if (res.data.data.length === 0 && (clips || Array.isArray(clips) || clips.length > 1)) {
              setClipsLoadmoreLoaded(true);
              return "";
            }
            clipPagination.current = res.data.pagination.cursor;
            const finallClips = await AddVideoExtraData({ items: res.data });

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
      });
    },
    [numberOfVideos, sortClipsBy, channelId, clips]
  );

  const getChannelInfo = useCallback(async () => {
    if (!channelInfo) {
      const res = await fetchChannelInfo(channelId, true);
      setChannelInfo(res);
    }
  }, [channelInfo, channelId]);

  useEffect(() => {
    document.title = `AF | ${channelName}'s Channel`;
  }, [channelName]);

  useEffect(() => {
    (async () => {
      if (twitchToken) {
        if (!channelId)
          await validateToken().then(async () => {
            await getIdFromName();
          });
        if (!channelInfo && channelId && channelId !== "Not Found") {
          await validateToken().then(async () => {
            await getChannelInfo();
          });
        }
      }
    })();
  }, [channelInfo, getChannelInfo, getIdFromName, channelId, twitchToken]);

  const OnlineEvents = useCallback(async () => {
    console.log("Stream is Online");
    document.title = `AF | ${channelName}'s Channel (Live)`;

    try {
      if (twitchPlayer.current) {
        const streamInfo = await fetchStreamInfo(
          twitchPlayer.current && twitchPlayer.current.getChannelId()
            ? { user_id: twitchPlayer.current.getChannelId() }
            : { user_login: channelName }
        );
        if (streamInfo) {
          setStreamInfo(streamInfo);
          setIsLive(true);
        }
      }
    } catch (error) {
      console.log("OnlineEvents -> error", error);
    }
  }, [channelName]);

  const offlineEvents = () => {
    console.log("Stream is Offline");
    setIsLive(false);
  };

  useEffect(() => {
    try {
      if (twitchToken) {
        if (!twitchPlayer.current) {
          twitchPlayer.current = new window.Twitch.Player("twitch-embed", {
            width: `${300 * 1.777777777777778}px`,
            height: "300px",
            theme: "dark",
            layout: "video",
            channel: channelName,
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
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [channelName, OnlineEvents, twitchToken]);

  useEffect(() => {
    if (twitchToken && channelId && !vods && channelId !== "Not Found") {
      fetchChannelVods();
    }
  }, [fetchChannelVods, vods, channelId, twitchToken]);

  useEffect(() => {
    if (twitchToken && channelId && !clips && channelId !== "Not Found") {
      fetchClips();
    }
  }, [fetchClips, clips, channelId, twitchToken]);

  useEffect(() => {
    if (twitchToken && channelInfo) {
      setFavion(channelInfo.logo);
    }
    return () => {
      setFavion();
    };
  }, [channelInfo, twitchToken]);

  if (channelId === "Not Found" || !getCookie("Twitch-access_token")) {
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
                    {!getCookie("Twitch-access_token")
                      ? "Can't fetch channel info, no access token found."
                      : channelName}
                  </p>
                </div>
                <p id='title'>
                  {!getCookie("Twitch-access_token")
                    ? "You need to connect with your Twitch account."
                    : "Channel Not Found!"}
                </p>
                <ReAuthenticateButton
                  disconnect={() => disconnectTwitch({ setTwitchToken, setEnableTwitch })}
                  serviceName={"Twitch"}
                  style={{ margin: "20px", justifyContent: "center" }}
                />
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
              src={`https://www.twitch.tv/embed/${channelName}/chat?darkpopout`}
              // style={{ display: chatOpen ? "block" : "none" }}
            />
          )}
          {videoOpen ? (
            <VideoChatButton
              title='Close video'
              id='closeVideo'
              onClick={() => {
                setVideoOpen(!videoOpen);
              }}>
              <FaWindowClose size={20} />
              Close player
            </VideoChatButton>
          ) : (
            <VideoChatButton
              title='Open video'
              id='openVideo'
              onClick={() => {
                setVideoOpen(!videoOpen);
              }}>
              <MdLiveTv size={30} />
              Open player
            </VideoChatButton>
          )}
          {chatOpen ? (
            <VideoChatButton
              title='Close chat'
              id='closeChat'
              onClick={() => {
                setChatOpen(!chatOpen);
              }}>
              Close player
              <FaWindowClose size={20} />
            </VideoChatButton>
          ) : (
            <VideoChatButton
              title='Open chat'
              id='openChat'
              onClick={() => {
                setChatOpen(!chatOpen);
              }}>
              Open player
              <MdChat size={30} />
            </VideoChatButton>
          )}
          {channelInfo ? (
            <Banner>
              {/* <img id='Banner' alt='' src={channelInfo.profile_banner} /> */}
              <BannerInfoOverlay>
                <Name>
                  {channelInfo && <BlurredBannerImage image={channelInfo.profile_banner} />}

                  <div id='HeaderChannelInfo'>
                    <div id='ChannelName'>
                      {isLive && streamInfo && (
                        <StyledLiveInfoContainer
                          to={{
                            pathname: `/${channelName}`,
                            state: {
                              p_channelInfos: streamInfo,
                            },
                          }}>
                          <div id='LiveDetails'>
                            <AnimatedViewCount
                              viewers={streamInfo.viewer_count}
                              prefix={"Viewers:"}
                            />
                            <span>
                              Uptime:{" "}
                              <Moment interval={1} durationFromNow>
                                {streamInfo.started_at}
                              </Moment>
                            </span>
                          </div>

                          <LiveIndicator style={{ padding: "0 15px" }}>
                            <LiveIndicatorIcon />
                            <p>Live</p>
                          </LiveIndicator>
                        </StyledLiveInfoContainer>
                      )}
                      <Link
                        to={{
                          pathname: `/${channelName}`,
                          state: {
                            p_channelInfos: streamInfo,
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
                      {channelInfo && (
                        <>
                          <FollowUnfollowBtn channelName={channelName} id={channelInfo._id} />
                          <AddUpdateNotificationsButton channel={channelName} size={30} />
                        </>
                      )}
                    </div>
                    <p id='title'>{channelInfo.status}</p>
                    <Link to={`/category/${channelInfo.game}`} id='game'>
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
