'use strict';

const AES = require('crypto-js/aes');
const enc = require('crypto-js/enc-utf8');

const decrypt = async (data) => {
  if (data) {
    const bytes = await AES.decrypt(data, process.env.ENCODE_KEY);
    return bytes.toString(enc);
  }
  return null;
};

const encrypt = async (data) => {
  if (data) {
    return await AES.encrypt(data, process.env.ENCODE_KEY).toString();
  }
  return null;
};

module.exports = {
  encrypt,
  decrypt,
};
