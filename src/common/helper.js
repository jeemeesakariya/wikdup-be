const statuscode = require('./statuscode');
require('dotenv').config();
const knex = require('../config/db');
const jwt = require('jsonwebtoken');

const sendResponse = ({ res, success, statusCode, message, data = [] }) => {
  return res.status(200).json({
    success,
    statusCode,
    message,
    data,
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
        statusCode: statuscode.R_BAD_REQUEST,
        message: errors,
      });
    }

    next();
  };
};

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);
    if (!token) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_UNAUTHORIZED,
        message: 'No token provided',
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    if (!decoded) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_UNAUTHORIZED,
        message: 'Invalid token',
      });
    }

    const user = await knex('user_master_data')
      .where({ id: decoded.id })
      .where('is_deleted', 0)
      .first();
    if (!user) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_UNAUTHORIZED,
        message: 'User not found',
      });
    }

    // Assuming the token contains user information
    // You can modify this based on your token structure

    req.user = decoded;

    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_UNAUTHORIZED,
      message: 'Token verification failed',
    });
  }
};

module.exports = {
  auth,
  sendResponse,
  validater,
};
