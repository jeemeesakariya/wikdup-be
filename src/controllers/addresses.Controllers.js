const { sendResponse } = require('../common/helper');
const knex = require('../config/db');
const statuscode = require('../common/statuscode');
require('dotenv').config();

const getAllAddressesHandler = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    if (!user_id) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_BAD_REQUEST,
        message: 'User id is required in query params',
      });
    }

    //validate userid
    const user = await knex('user_master_data').where('id', user_id).first();
    if (!user) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'User not found, wrong user_id',
      });
    }

    const addresses = await knex('address_master').where('user_id', user_id).select('*');

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Addresses found successfully',
      data: addresses,
    });
  } catch (err) {
    console.log(err);
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

const createAddressHandler = async (req, res) => {
  try {
    const { user_id, address_line1, address_line2, city, state, pincode, country } = req.body;

    // validate user_id
    const user = await knex('user_master_data').where('id', user_id).first();
    if (!user) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'User not found, wrong user_id',
      });
    }

    const [id] = await knex('address_master').insert({
      user_id,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country: country || 'India',
    });

    if (!id) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
        message: 'Failed to create address',
      });
    }

    const newAddress = await knex('address_master').where('id', id).first();

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Address created successfully',
      data: [newAddress],
    });
  } catch (err) {
    console.log(err);
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

const updateAddressHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, address_line1, address_line2, city, state, pincode, country } = req.body;

    // validate id
    const address = await knex('address_master').where('id', id).first();
    if (!address) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'Address not found, wrong id in params',
      });
    }

    // validate user_id
    const user = await knex('user_master_data').where('id', user_id).first();
    if (!user) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'User not found, wrong user_id',
      });
    }

    const updateAddressData = {
      user_id,
      address_line1,
    };

    if (address_line2) {
      updateAddressData.address_line2 = address_line2;
    }
    if (city) {
      updateAddressData.city = city;
    }
    if (state) {
      updateAddressData.state = state;
    }
    if (pincode) {
      updateAddressData.pincode = pincode;
    }
    if (country) {
      updateAddressData.country = country;
    }

    await knex('address_master').where('id', id).update(updateAddressData);

    const newAddress = await knex('address_master').where('id', id).first();

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Address updated successfully',
      data: [newAddress],
    });
  } catch (err) {
    console.log(err);
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

const deleteAddressHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // validate id
    const address = await knex('address_master').where('id', id).first();
    if (!address) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'Address not found, wrong id in params',
      });
    }

    await knex('address_master').where('id', id).delete();

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Address deleted successfully',
    });
  } catch (err) {
    console.log(err);
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  }
};

module.exports = {
  getAllAddressesHandler,
  createAddressHandler,
  updateAddressHandler,
  deleteAddressHandler,
};
