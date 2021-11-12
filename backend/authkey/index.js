'use strict';

const { decrypt } = require('../crypto');
const CustomException = require('../CustomException');

const validateAuthkey = async (encryptedAuthkey) => {
  if (encryptedAuthkey) {
    const authkeyDataDecrypted = await decrypt(encryptedAuthkey);
    const [username, expireDate] = authkeyDataDecrypted.split('@@');
    if (Date.now() > expireDate) throw new CustomException('Invalid/expired Auth-key', 401);
    return username;
  }
  throw new CustomException('Invalid/expired Auth-key', 401);
};

module.exports = {
  validateAuthkey,
};
