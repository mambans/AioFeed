import { ic_favorite } from "react-icons-kit/md/ic_favorite";
import { ic_favorite_border } from "react-icons-kit/md/ic_favorite_border";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, { useEffect, useCallback, useState, useRef, useContext } from "react";
import Tooltip from "react-bootstrap/Tooltip";

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
  FollowUnfollowButton,
} from "./StyledComponents";

export default () => {
  const { id } = useParams();
  const [channelInfo, setChannelInfo] = useState();
  const [vods, setVods] = useState();
  const [clips, setClips] = useState();
  const [vodsloadmoreLoaded, setVodsLoadmoreLoaded] = useState(true);
  const [clipsloadmoreLoaded, setClipsLoadmoreLoaded] = useState(true);
  const [sortVodsBy, setSortVodsBy] = useState("Time");
  const [sortClipsBy, setSortClipsBy] = useState(null);
  const [following, setFollowing] = useState(false);
  const [channelId, setChannelId] = useState();

  const numberOfVideos = Math.floor(document.documentElement.clientWidth / 350);
  const vodPagination = useRef();
  const previosVodPage = useRef();
  const previosClipsPage = useRef();
  const clipPagination = useRef();
  const loadmoreVodsRef = useRef();
  const loadmoreClipsRef = useRef();

  const { setTwitchToken, twitchToken, setRefreshToken, twitchUserId } = useContext(AccountContext);

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
      });
  }, [id, twitchToken]);

  const fetchChannelInfo = useCallback(async () => {
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
      });
  }, [twitchToken, channelId]);

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
        console.log(`Failed to unfollow ${channelId.display_name}. `, error);
        console.log(`Trying to auto re-authenticate with Twitch.`);

        await axios
          .post(
            `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURI(
              Utilities.getCookie("Twitch-refresh_token")
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
                console.log(`Unfollowed: ${channelInfo.display_name}`);
                // data.refresh();
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
    [numberOfVideos, sortVodsBy, channelId]
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
    [numberOfVideos, sortClipsBy, channelId]
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
          setFollowing(false);
        });
    };

    const checkIfLive = async () => {
      return await axios
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
          if (res.data.data.length > 0) return true;
        });
    };

    let ChannelInfos = await fetchChannelInfo();
    ChannelInfos.isLive = await checkIfLive();

    setChannelInfo(ChannelInfos);
    CheckIfFollowed(ChannelInfos._id);

    document.title = `${ChannelInfos.display_name} | Notifies`;
  }, [id, fetchChannelInfo, twitchUserId, twitchToken]);

  useEffect(() => {
    const fetchAllChannelData = async () => {
      if (!channelId) await getIdFromName();
      if (!channelInfo && channelId) getChannelInfo();
    };

    fetchAllChannelData();
  }, [channelInfo, getChannelInfo, getIdFromName, channelId]);

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

  return (
    <ChannelContainer>
      {channelInfo ? (
        <Banner>
          <img id='Banner' alt='' src={channelInfo.profile_banner} />
          <BannerInfoOverlay>
            <Name>
              <div id='HeaderChannelInfo'>
                <div id='ChannelName'>
                  {channelInfo.isLive ? (
                    <Link to={`/twitch/live/${id}`} style={{ padding: "0" }}>
                      <LiveIndicator>
                        <LiveIndicatorIcon />
                        <p>Live</p>
                      </LiveIndicator>
                    </Link>
                  ) : null}
                  <Link to={`/twitch/live/${id}`} id='ChannelLiveLink'>
                    <img id='profileIcon' alt='' src={channelInfo.logo} />
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
                      <FollowUnfollowButton
                        following={following.toString()}
                        icon={ic_favorite}
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
                      <FollowUnfollowButton
                        following={following.toString()}
                        icon={ic_favorite_border}
                        onClick={() => {
                          setFollowing(true);
                          followStream(channelInfo._id);
                        }}
                      />
                    </OverlayTrigger>
                  )}
                </div>
                <p id='title'>{channelInfo.status}</p>
                <Link to={`/twitch/top/${channelInfo.game}`} id='game'>
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
