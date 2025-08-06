const express = require('express');
const {
  loginHandler,
  registerHandler,
  otpRequestHandler,
} = require('../controllers/auth.controller');
const { validater } = require('../common/helper');
const { authSchema } = require('../validation/auth.Validation');

const router = express.Router();

router.post('/request-otp', validater(authSchema.requestOtp), otpRequestHandler);
router.post('/login', validater(authSchema.login), loginHandler);
router.post('/register', registerHandler);

module.exports = router;
