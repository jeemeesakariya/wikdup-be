const { sendResponse } = require('../common/helper');
const knex = require('../config/db');
const statuscode = require('../common/statuscode');
const { get } = require('../routes/coupon.Routes');

// Create a new coupon
const createCoupon = async (req, res) => {
  try {
    const { code, discount_type, discount_value, valid_from, valid_till,status } = req.body;

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
      status
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
const getCoupons = async (req, res) => {
  try {

    // Fetch coupon by ID
    const id = req.query.id;
    let coupon = knex('coupon_master');
    if (id) {
      coupon = coupon.where('id', id);
    }
    coupon = await coupon.select();

    if (!coupon.length) {
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

const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount_type, discount_value, valid_from, valid_till, status } = req.body;
    const updatedFields = {};
    if (req.body.code) updatedFields.code = req.body.code;
    if (req.body.discount_type) updatedFields.discount_type = req.body.discount_type;
    if (req.body.discount_value) updatedFields.discount_value = req.body.discount_value;
    if (req.body.valid_from) updatedFields.valid_from = new Date(req.body.valid_from);
    if (req.body.valid_till) updatedFields.valid_till = new Date(req.body.valid_till);
    if (req.body.status) updatedFields.status = req.body.status;
    // Check if coupon exists
    const existingCoupon = await knex('coupon_master').where({ id }).first();
    if (!existingCoupon) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'Coupon not found',
      });
    }

    // Update coupon
    await knex('coupon_master').where({ id }).update(updatedFields);
    const updatedCoupon = await knex('coupon_master').where({ id }).first();

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Coupon updated successfully',
      data: updatedCoupon,
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
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
  getCoupons,
  updateCoupon,
};
