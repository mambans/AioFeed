import { MdChat } from 'react-icons/md';
import { FaWindowClose, FaRegClock } from 'react-icons/fa';
import { MdLiveTv } from 'react-icons/md';
import { useParams, useLocation, Link } from 'react-router-dom';
import React, { useEffect, useCallback, useState, useRef, useContext } from 'react';
import Moment from 'react-moment';

import LoadingPlaceholderBanner from './LoadingPlaceholderBanner';
import LoadingPlaceholderClips from './LoadingPlaceholderClips';
import LoadingPlaceholderVods from './LoadingPlaceholderVods';
import SubFeed from './SubFeed';
import { addVodEndTime } from './../TwitchUtils';
import {
  ChannelContainer,
  Banner,
  Name,
  BannerInfoOverlay,
  VideoPlayer,
  Chat,
  StyledLiveInfoContainer,
  BlurredBannerImage,
  VideoChatButton,
  ProfileImage,
  NameAndButtons,
  ButtonRow,
  FullDescriptioon,
} from './StyledComponents';
import FollowUnfollowBtn from './../FollowUnfollowBtn';
import AddVideoExtraData from '../AddVideoExtraData';
import fetchStreamInfo from './../player/fetchStreamInfo';
import fetchChannelInfo from './../player/fetchChannelInfo';
import setFavion from '../setFavion';
// import AddUpdateNotificationsButton from '../AddUpdateNotificationsButton';
import API from './../API';
import AnimatedViewCount from '../live/AnimatedViewCount';
import { getCookie } from '../../../util/Utils';
import disconnectTwitch from '../disconnectTwitch';
import AccountContext from '../../account/AccountContext';
import ReAuthenticateButton from '../../navigation/sidebar/ReAuthenticateButton';
import useEventListenerMemo from '../../../hooks/useEventListenerMemo';
import useQuery from '../../../hooks/useQuery';
import loginNameFormat from '../loginNameFormat';
import useToken from '../useToken';
import VodsFollowUnfollowBtn from '../vods/VodsFollowUnfollowBtn';
import AddUpdateNotificationsButton from '../AddUpdateNotificationsButton';
import FavoriteStreamBtn from '../live/FavoriteStreamBtn';

const ChannelPage = () => {
  const { passedChannelData } = useLocation().state || {};
  const { channelName } = useParams();
  const [channelInfo, setChannelInfo] = useState(passedChannelData);
  const [streamInfo, setStreamInfo] = useState(passedChannelData);
  const numberOfVideos = Math.floor(window.innerWidth / 350);
  const { setTwitchToken } = useContext(AccountContext);
  const URLQueries = useQuery();
  const validateToken = useToken();

  const [vods, setVods] = useState();
  const [clips, setClips] = useState();
  const [sortVodsBy, setSortVodsBy] = useState(
    URLQueries.get('type')?.toLowerCase() === 'vods'
      ? URLQueries.get('sort')?.toLowerCase()
      : 'time'
  );
  const [sortClipsBy, setSortClipsBy] = useState(
    URLQueries.get('type')?.toLowerCase() === 'clips' ? URLQueries.get('within') : null
  );
  const [channelId, setChannelId] = useState(passedChannelData?.user_id);
  const [isLive, setIsLive] = useState();
  const [videoOpen, setVideoOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const vodPagination = useRef();
  const previosVodPage = useRef();
  const previosClipsPage = useRef();
  const clipPagination = useRef();
  const twitchPlayer = useRef();

  useEventListenerMemo(window?.Twitch?.Player?.ONLINE, onlineEvents, twitchPlayer.current);
  useEventListenerMemo(window?.Twitch?.Player?.OFFLINE, offlineEvents, twitchPlayer.current);

  const getIdFromName = useCallback(async () => {
    await API.getUser({
      params: {
        login: channelName,
      },
      throwError: false,
    })
      .then((res) => setChannelId(res.data.data[0].id))
      .catch((error) => setChannelId('Not Found'));
  }, [channelName]);

  const fetchChannelVods = useCallback(
    async (pagination, setLoading) => {
      await validateToken().then(async () => {
        if (pagination) {
          setLoading(true);
        } else {
          previosVodPage.current = null;
        }

        await API.getVideos({
          params: {
            user_id: channelId,
            first: numberOfVideos,
            sort: sortVodsBy?.toLowerCase(),
            type: 'all',
            after: pagination || null,
          },
        })
          .then(async (res) => {
            if (
              res.data.data?.length === 0 &&
              (!vods || !Array.isArray(vods) || vods?.length < 1)
            ) {
              setVods({ error: 'No vods available' });
              return '';
            }

            if (res.data.data?.length === 0 && (vods || Array.isArray(vods) || vods?.length > 1)) {
              setLoading(false);
              return '';
            }
            vodPagination.current = res.data.pagination.cursor;

            const videos = await AddVideoExtraData({ items: res.data, fetchGameInfo: false });
            const finallVideos = await addVodEndTime(videos.data);

            if (pagination) {
              const allVods = previosVodPage.current.concat(finallVideos);
              previosVodPage.current = allVods;

              setLoading(false);
              setVods(allVods);
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
    [numberOfVideos, sortVodsBy, channelId, vods, validateToken]
  );

  const fetchClips = useCallback(
    async (pagination, setLoading) => {
      await validateToken().then(async () => {
        if (pagination) {
          setLoading(true);
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
              res.data.data?.length === 0 &&
              (!clips || !Array.isArray(clips) || clips?.length < 1)
            ) {
              setClips({ error: 'No clips available' });
              return '';
            }

            if (
              res.data.data?.length === 0 &&
              (clips || Array.isArray(clips) || clips?.length > 1)
            ) {
              setLoading(false);
              return '';
            }
            clipPagination.current = res.data.pagination.cursor;
            const finallClips = await AddVideoExtraData({ items: res.data });

            if (pagination) {
              const allClips = previosClipsPage.current.concat(finallClips.data);
              previosClipsPage.current = allClips;
              setLoading(false);
              setClips(allClips);
            } else {
              previosClipsPage.current = finallClips.data;
              setClips(finallClips.data);
            }
          })
          .catch((error) => console.error('fetchClips: ', error));
      });
    },
    [numberOfVideos, sortClipsBy, channelId, clips, validateToken]
  );

  const getChannelInfo = useCallback(async () => {
    if (!channelInfo) {
      const res = await validateToken().then(() => fetchChannelInfo(channelId, true));

      setChannelInfo(res);
    }
  }, [channelInfo, channelId, validateToken]);

  useEffect(() => {
    document.title = `${channelName}'s Channel`;
  }, [channelName]);

  useEffect(() => {
    (async () => {
      if (!channelId) {
        await validateToken(true).then(async () => await getIdFromName());
      } else if (!channelInfo && channelId && channelId !== 'Not Found') {
        await validateToken(true).then(async () => await getChannelInfo());
      }
    })();
  }, [channelInfo, getChannelInfo, getIdFromName, channelId, validateToken]);

  async function onlineEvents() {
    console.log('Stream is Online');
    document.title = `${channelName}'s Channel (Live)`;

    try {
      if (twitchPlayer.current) {
        const streamInfo = await validateToken().then(() =>
          fetchStreamInfo(
            twitchPlayer.current && twitchPlayer.current.getChannelId()
              ? { user_id: twitchPlayer.current.getChannelId() }
              : { user_login: channelName }
          )
        );
        if (streamInfo) {
          setStreamInfo(streamInfo);
          setIsLive(true);
        }
      }
    } catch (error) {
      console.log('onlineEvents -> error', error);
    }
  }

  function offlineEvents() {
    console.log('Stream is Offline');
    setIsLive(false);
  }

  useEffect(() => {
    if (!twitchPlayer.current && window.Twitch.Player) {
      twitchPlayer.current = new window.Twitch.Player('twitch-embed', {
        width: `${300 * 1.777777777777778}px`,
        height: '300px',
        theme: 'dark',
        layout: 'video',
        channel: channelName,
        muted: true,
      });
    }
  }, [channelName]);

  useEffect(() => {
    if (channelId && !vods && channelId !== 'Not Found') {
      fetchChannelVods();
    }
  }, [fetchChannelVods, vods, channelId]);

  useEffect(() => {
    if (channelId && !clips && channelId !== 'Not Found') {
      fetchClips();
    }
  }, [fetchClips, clips, channelId]);

  useEffect(() => {
    if (channelInfo) {
      setFavion(channelInfo.logo || channelInfo.profile_image_url);
    }
    return () => setFavion();
  }, [channelInfo]);

  if (channelId === 'Not Found') {
    return (
      <ChannelContainer>
        <Banner>
          <BannerInfoOverlay
            style={{
              backgroundColor: 'var(--navigationbarBackground)',
              width: 'calc(100% - 60px)',
              margin: 'auto',
              borderRadius: '15px',
            }}
          >
            <Name>
              <div id='HeaderChannelInfo' style={{ height: '80%' }}>
                <div id='ChannelName'>
                  <p className='ChannelLiveLink'>
                    <ProfileImage>
                      <img alt='' src='' />
                    </ProfileImage>
                    {!getCookie('Twitch-access_token')
                      ? "Can't fetch channel info, no access token found."
                      : channelName}
                  </p>
                </div>
                <p id='title'>
                  {!getCookie('Twitch-access_token')
                    ? 'You need to connect with your Twitch account.'
                    : 'Channel Not Found!'}
                </p>
                <ReAuthenticateButton
                  disconnect={() => disconnectTwitch({ setTwitchToken })}
                  serviceName={'Twitch'}
                  style={{ margin: '20px', justifyContent: 'center' }}
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
        <ChannelContainer>
          <VideoPlayer id='twitch-embed' style={{ display: videoOpen ? 'block' : 'none' }} />
          {chatOpen && (
            <Chat
              frameborder='0'
              scrolling='yes'
              theme='dark'
              src={`https://www.twitch.tv/embed/${channelName}/chat?darkpopout&parent=aiofeed.com`}
            />
          )}
          {videoOpen ? (
            <VideoChatButton
              title='Close video'
              id='closeVideo'
              onClick={() => {
                setVideoOpen(!videoOpen);
              }}
            >
              <FaWindowClose size={20} />
              Close video
            </VideoChatButton>
          ) : (
            <VideoChatButton
              title='Open video'
              id='openVideo'
              onClick={() => {
                setVideoOpen(!videoOpen);
              }}
            >
              <MdLiveTv size={30} />
              Open video
            </VideoChatButton>
          )}
          {chatOpen ? (
            <VideoChatButton
              title='Close chat'
              id='closeChat'
              onClick={() => {
                setChatOpen(!chatOpen);
              }}
            >
              Close chat
              <FaWindowClose size={20} />
            </VideoChatButton>
          ) : (
            <VideoChatButton
              title='Open chat'
              id='openChat'
              onClick={() => {
                setChatOpen(!chatOpen);
              }}
            >
              Open chat
              <MdChat size={30} />
            </VideoChatButton>
          )}
          {channelInfo ? (
            <Banner>
              <BannerInfoOverlay>
                <Name>
                  {channelInfo && <BlurredBannerImage image={channelInfo.profile_banner} />}

                  <div id='HeaderChannelInfo'>
                    <div id='ChannelName'>
                      {Boolean(isLive && streamInfo) && (
                        <StyledLiveInfoContainer
                          to={{
                            pathname: `/${channelName}`,
                            state: {
                              passedChannelData: streamInfo,
                            },
                          }}
                        >
                          <div id='LiveDetails'>
                            <AnimatedViewCount
                              disabePrefix={true}
                              viewers={streamInfo.viewer_count}
                            />
                            <span>
                              <Moment interval={1} durationFromNow>
                                {streamInfo.started_at}
                              </Moment>
                              <FaRegClock size={12} />
                            </span>
                          </div>
                        </StyledLiveInfoContainer>
                      )}
                      <Link
                        to={{
                          pathname: `/${channelName}`,
                          state: {
                            passedChannelData: streamInfo,
                          },
                        }}
                        className='ChannelLiveLink'
                      >
                        <ProfileImage live={Boolean(isLive && streamInfo)}>
                          <img alt='' src={channelInfo.logo || channelInfo.profile_image_url} />
                          {Boolean(isLive && streamInfo) && <div id='live'>Live</div>}
                        </ProfileImage>
                      </Link>
                      <NameAndButtons>
                        <div className='buttonsContainer'>
                          {channelInfo.partner && (
                            <img
                              id='partnered'
                              title='Partnered'
                              alt=''
                              src={`${process.env.PUBLIC_URL}/partnered.png`}
                            />
                          )}
                          <FollowUnfollowBtn
                            show={channelInfo}
                            channelName={channelName}
                            id={channelInfo._id}
                          />
                          <FavoriteStreamBtn
                            channel={channelInfo.name || channelName}
                            show={Boolean(channelInfo)}
                            marginright={'5px'}
                          />
                          <VodsFollowUnfollowBtn
                            size={28}
                            channel={channelInfo.name || channelName}
                            channelId={channelInfo._id}
                          />

                          <AddUpdateNotificationsButton
                            show={channelInfo}
                            channel={channelInfo.name || channelName}
                            size={26}
                          />
                        </div>
                        <Link
                          to={{
                            pathname: `/${channelName}`,
                            state: {
                              passedChannelData: streamInfo,
                            },
                          }}
                          id='name'
                        >
                          {loginNameFormat({ ...channelInfo, login: channelInfo.name })}
                        </Link>
                      </NameAndButtons>
                    </div>
                    <Link
                      id='title'
                      to={{
                        pathname: `/${channelName}`,
                        state: {
                          passedChannelData: streamInfo || channelInfo,
                        },
                      }}
                      className='ChannelLiveLink'
                    >
                      {channelInfo.status}
                    </Link>
                    <span>
                      {Boolean(isLive && streamInfo) ? 'Playing ' : 'Played '}
                      <Link to={`/category/${channelInfo.game}`} id='game'>
                        {channelInfo.game}
                      </Link>
                    </span>

                    <ButtonRow>
                      <FullDescriptioon>{channelInfo.description}</FullDescriptioon>
                      <div id='stats'>
                        <p>{channelInfo.followers} followers</p>
                        <p>{channelInfo.views} views</p>
                      </div>
                    </ButtonRow>
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
              fetchItems={fetchChannelVods}
              itemPagination={vodPagination}
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
              fetchItems={fetchClips}
              itemPagination={clipPagination}
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
export default ChannelPage;
