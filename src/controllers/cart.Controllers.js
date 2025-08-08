const { sendResponse } = require('../common/helper');
const knex = require('../config/db');
const statuscode = require('../common/statuscode');
require('dotenv').config();

const getCartHandler = async (req, res) => { };

const getTotalHandler = async (req, res) => {};

const createCartItemHandler = async (req, res) => {};

const updateCartItemHandler = async (req, res) => {};

const deleteCartItemHandler = async (req, res) => {};

const applyCouponHandler = async (req, res) => {};

const deleteCouponHandler = async (req, res) => {};

module.exports = {
  getCartHandler,
  getTotalHandler,
  createCartItemHandler,
  updateCartItemHandler,
  deleteCartItemHandler,
  applyCouponHandler,
  deleteCouponHandler,
};
