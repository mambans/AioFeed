function CustomException(message, statusCode) {
  const error = new Error(message);

  error.code = statusCode;
  return error;
}

module.exports = CustomException.prototype = Object.create(Error.prototype);
