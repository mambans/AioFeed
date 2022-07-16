'use strict';

const parseAuthorization = async (Authorization) => {
  if (Authorization) {
    const arr = Authorization.split('.');

    const data = arr.reduce((acc, string) => {
      try {
        const buffer = new Buffer.from(string, 'base64');
        const parsedBuffer = JSON.parse(buffer.toString());

        return Object.assign(acc, parsedBuffer);
      } catch (e) {
        return acc;
      }
    }, {});

    return data;
  }
  return {};
};

module.exports = {
  parseAuthorization,
};
