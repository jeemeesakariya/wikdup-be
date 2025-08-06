// helper.js
const { StatusCodes } = require('http-status-codes');

const sendResponse = ({ res, success, statusCode, message, data = [] }) => {
  return res.status(StatusCodes.OK).json({
    success,
    statusCode,
    message,
    data
  });
};

const validater = (schema) => {
  return (req, res, next) => {
    const sources = ['body', 'query', 'params'];
    const errors = [];

    for (const source of sources) {
      if (schema[source]) {
        const { error } = schema[source].validate(req[source], { abortEarly: false });
        if (error) {
          errors.push(...error.details.map((d) => `${source}: ${d.message}`));
        }
      }
    }

    if (errors.length) {
      return sendResponse({
        res,
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: errors
      });
    }

    next();
  };
};

module.exports = {
  sendResponse,
  validater
};
