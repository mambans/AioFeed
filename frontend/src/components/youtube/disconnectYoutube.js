import axios from 'axios';
import { getCookie, RemoveCookie } from '../../util/Utils';

export default async ({ setYoutubeToken, setEnableYoutube }) => {
  RemoveCookie('Youtube-access_token');
  RemoveCookie('YoutubeUsername');
  RemoveCookie('YoutubeProfileImg');
  RemoveCookie('Youtube_FeedEnabled');
  RemoveCookie('Youtube-myState');

  setYoutubeToken();
  setEnableYoutube(false);

  await axios
    .delete(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/youtube/token`, {
      data: {
        username: getCookie('AioFeed_AccountName'),
        authkey: getCookie(`AioFeed_AuthKey`),
      },
    })
    .then(() => console.log(`Successfully disconnected from Youtube`))
    .catch((e) => console.error(e));

  await axios.post(
    `https://oauth2.googleapis.com/revoke?token=${getCookie('Youtube-access_token')}`,
    {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    }
  );
};
