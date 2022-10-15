import { AddCookie } from '../../util';
import API from '../navigation/API';

const autoReauthenticate = async () => {
  return await API.getYoutubeTokens().then(async (res) => {
    AddCookie('Youtube-access_token', res.access_token);
    return res;
  });
};

export default autoReauthenticate;
