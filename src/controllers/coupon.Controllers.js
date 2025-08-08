const { sendResponse } = require('../common/helper');
const knex = require('../config/db');
const statuscode = require('../common/statuscode');

// Create a new coupon
const createCoupon = async (req, res) => {
  try {
    const { code, discount_type, discount_value, valid_from, valid_till, usage_limit } = req.body;
    if(!code || !discount_type || !discount_value || !valid_from || !valid_till) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_BAD_REQUEST,
        message: 'All fields are required',
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await knex('coupon_master').where({ code }).first();
    if (existingCoupon) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_CONFLICT,
        message: 'Coupon code already exists',
      });
    }

    // Validate dates
    const fromDate = new Date(valid_from);
    const tillDate = new Date(valid_till);
    const currentDate = new Date();

    if (fromDate >= tillDate) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_BAD_REQUEST,
        message: 'Valid from date must be before valid till date',
      });
    }

    if (tillDate < currentDate) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_BAD_REQUEST,
        message: 'Valid till date cannot be in the past',
      });
    }

    // Create coupon
    const [couponId] = await knex('coupon_master').insert({
      code,
      discount_type,
      discount_value,
      valid_from: fromDate,
      valid_till: tillDate,
      usage_limit: usage_limit || 1,
    });

    // Fetch the created coupon
    const newCoupon = await knex('coupon_master').where({ id: couponId }).first();

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Coupon created successfully',
      data: newCoupon,
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
};

// Get coupon by ID
const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch coupon by ID
    const coupon = await knex('coupon_master').where({ id }).first();

    if (!coupon) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'Coupon not found',
      });
    }

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Coupon retrieved successfully',
      data: coupon,
    });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  createCoupon,
  getCouponById,
};
