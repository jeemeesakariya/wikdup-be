const Joi = require('joi');

const cartItemSchema = {
  createCartItem: {
    body: Joi.object({
      user_id: Joi.number().integer().positive().required().messages({
        'number.base': 'User ID must be a number.',
        'number.integer': 'User ID must be an integer.',
        'number.positive': 'User ID must be positive.',
        'any.required': 'User ID is required.',
      }),

      product_id: Joi.number().integer().positive().required().messages({
        'number.base': 'Product ID must be a number.',
        'number.integer': 'Product ID must be an integer.',
        'number.positive': 'Product ID must be positive.',
        'any.required': 'Product ID is required.',
      }),

      quantity: Joi.number().integer().positive().required().messages({
        'number.base': 'Quantity must be a number.',
        'number.integer': 'Quantity must be an integer.',
        'number.positive': 'Quantity must be positive.',
        'any.required': 'Quantity is required.',
      }),
    }),
  },


  updateCartItem: {
    params: Joi.object({
      cartItemId: Joi.number().integer().positive().required().messages({
        'number.base': 'Cart item ID must be a number.',
        'number.integer': 'Cart item ID must be an integer.',
        'number.positive': 'Cart item ID must be positive.',
        'any.required': 'Cart item ID is required.',
      }),
    }),
    body: Joi.object({
      quantity: Joi.number().integer().positive().messages({
        'number.base': 'Quantity must be a number.',
        'number.integer': 'Quantity must be an integer.',
        'number.positive': 'Quantity must be positive.',
      }),
    }),
  },

  deleteCartItem: {
    params: Joi.object({
      cartItemId: Joi.number().integer().positive().required().messages({
        'number.base': 'Cart item ID must be a number.',
        'number.integer': 'Cart item ID must be an integer.',
        'number.positive': 'Cart item ID must be positive.',
        'any.required': 'Cart item ID is required.',
      }),
    }),
  },
};

module.exports = {
  cartItemSchema,
};
