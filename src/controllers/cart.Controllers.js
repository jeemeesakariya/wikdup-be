const { sendResponse } = require('../common/helper');
const knex = require('../config/db');
const statuscode = require('../common/statuscode');
require('dotenv').config();

const getTotalHandler = async (req, res) => {
  try {
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

const getCartHandler = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await knex('cart_item_data')
      .leftJoin('product_master', 'cart_item_data.product_id', 'product_master.id')
      .where('user_id', userId)
      .select('*');

    if (!cartItems.length) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'Cart items not found',
      });
    }

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Cart items fetched successfully',
      data: cartItems,
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

const createCartItemHandler = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    // validate user_id and product_id
    const user = await knex('user_master_data').where('id', user_id).first();
    if (!user) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'User not found, wrong user_id',
      });
    }

    // validate product_id
    const product = await knex('product_master').where('id', product_id).first();
    if (!product) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'Product not found, wrong product_id',
      });
    }

    // create cart item
    const [id] = await knex('cart_item_data').insert({
      user_id,
      product_id,
      quantity,
    });

    if (!id) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
        message: 'Failed to create cart item',
      });
    }

    // get cart item
    const cartItem = await knex('cart_item_data').where('id', id).first();
    if (!cartItem) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
        message: 'Failed to get cart item',
      });
    }

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Cart item created successfully',
      data: cartItem,
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

const updateCartItemHandler = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    // cartitem validation
    const cartItem = await knex('cart_item_data').where('id', cartItemId).first();
    if (!cartItem) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'Cart item not found, wrong cartItemId',
      });
    }

    // update cart item
    const updatedCartItem = await knex('cart_item_data').where('id', cartItemId).update({
      quantity,
    });

    if (!updatedCartItem) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
        message: 'Failed to update cart item',
      });
    }

    const newCartItem = await knex('cart_item_data').where('id', cartItemId).first();

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Cart item updated successfully',
      data: newCartItem,
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

const deleteCartItemHandler = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    // cartitem validation
    const cartItem = await knex('cart_item_data').where('id', cartItemId).first();
    if (!cartItem) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'Cart item not found, wrong cartItemId',
      });
    }

    const deletedCartItem = await knex('cart_item_data').where('id', cartItemId).delete();

    if (!deletedCartItem) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
        message: 'Failed to delete cart item',
      });
    }

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'Cart item deleted successfully',
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

const applyCouponHandler = async (req, res) => {
  try {
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

const deleteCouponHandler = async (req, res) => {
  try {
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
  createCartItemHandler,
  getCartHandler,
  updateCartItemHandler,
  deleteCartItemHandler,
  applyCouponHandler,
  deleteCouponHandler,
};
