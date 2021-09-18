import axios from 'axios';
import { getCookie } from '../../util';
import autoReauthenticate from './autoReauthenticate';

const validateToken = async ({ authKey = getCookie(`AioFeed_AuthKey`) } = {}) => {
  const access_token = getCookie('Youtube-access_token');

  if (access_token) {
    // console.log('Youtube: Validating token..');
    return await axios
      .post(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${access_token}`)
      .then((res) => res)
      .catch((error) => {
        console.warn('YouTube: Invalid Access_token');
        return autoReauthenticate({ authKey });
      });
  }
  console.warn('YouTube: No Access_token found');
  return autoReauthenticate({ authKey });
  // throw new Error('No tokens found.');
};

export default validateToken;
