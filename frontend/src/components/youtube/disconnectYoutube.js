import axios from 'axios';
import { getCookie, RemoveCookie } from '../../util/Utils';
import API from '../navigation/API';

const disconnectYoutube = async ({ setYoutubeToken, setEnableYoutube }) => {
  RemoveCookie('Youtube-access_token');
  RemoveCookie('YoutubeUsername');
  RemoveCookie('YoutubeProfileImg');
  RemoveCookie('Youtube_FeedEnabled');
  RemoveCookie('Youtube-myState');

  setYoutubeToken();
  setEnableYoutube(false);

  await API.deleteYoutubeToken();

  await axios.post(
    `https://oauth2.googleapis.com/revoke?token=${getCookie('Youtube-access_token')}`,
    {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    }
  );
};

export default disconnectYoutube;
