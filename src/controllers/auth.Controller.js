const { sendResponse } = require('../common/helper');
const bcryptjs = require('bcryptjs');
const knex = require('../config/db');
const jwt = require('jsonwebtoken');
const UAParser = require('ua-parser-js');
const statuscode = require("../common/statuscode");
require('dotenv').config();

const otpRequestHandler = async (req, res) => {
  try {
    const { password } = req.body;
    let mobile = null;
    let email = null;

    if (req.body.email) {
      email = req.body?.email;
    } else {
      mobile = req.body?.mobile;
    }

    const isExists = await knex('user_master_data').where({ email }).orWhere({ mobile }).first();
    if (!isExists) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND ,
        message: 'User not found',
      });
    }

    const isMatch = bcryptjs.compareSync(password, isExists.password);
    if (!isMatch) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_BAD_REQUEST,
        message: 'Invalid credentials',
      });
    }

    // remove all old otps of this user
    await knex('otps').where({ mobile: isExists?.mobile, used: 0 }).delete();

    const otp = Math.floor(100000 + Math.random() * 900000);

    const [id] = await knex('otps').insert({
      mobile: isExists.mobile,
      otp_code: otp,
      expires_at: new Date(Date.now() + 10 * 60 * 1000),
      used: false,
    });

    return res.status(200).json({
      message: 'OTP sent successfully, otp will expire in 10 minutes',
      otp_code: otp,
    });
  } catch (err) {
    console.log(err);
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
    });
  }
};

const loginHandler = async (req, res) => {
  try {
    const { otp } = req.body;
    const now = new Date();

    let mobile = null;
    let email = null;

    if (req.body.email) {
      email = req.body.email;
    } else {
      mobile = req.body.mobile;
    }

    const user = await knex('user_master_data').where({ email }).orWhere({ mobile }).first();

    if (!user) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND ,
        message: 'User not found',
      });
    }

    const otpRecord = await knex('otps')
      .where({ mobile: user.mobile, otp_code: otp })
      .andWhere('used', false)
      .andWhere('expires_at', '>', now)
      .first();

    if (!otpRecord) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_BAD_REQUEST,
        message: 'Invalid or expired OTP',
      });
    }

    await knex('otps').where({ id: otpRecord.id }).update({ used: 1 });

    const accessToken = jwt.sign({ id: user.id, role: user.role_id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role_id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    const parser = new UAParser(req.headers['user-agent']);
    const deviceInfo = `${parser.getBrowser().name} on ${parser.getOS().name}`;

    await knex('user_sessions').insert({
      user_id: user.id,
      refresh_token: refreshToken,
      ip_address: ip,
      device_info: deviceInfo,
    });

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'User logged in successfully',
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
    });
  }
};

const registerHandler = async (req, res) => {
  try {
    const { full_name, mobile, email, password } = req.body;

    const isExists = await knex('user_master_data').where({ email }).orWhere({ mobile }).first();
    if (isExists) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_BAD_REQUEST,
        message: 'User already exists',
      });
    }

    const hasePw = bcryptjs.hashSync(password, 10);

    const [id] = await knex('user_master_data').insert({
      full_name,
      mobile,
      email,
      password: hasePw,
    });

    if (!id) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }

    const user = await knex('user_master_data').where({ id }).first();

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'User registed successfully',
      data: user,
    });
  } catch (err) {
    console.log(err);
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
    });
  }
};

module.exports = {
  otpRequestHandler,
  loginHandler,
  registerHandler,
};
