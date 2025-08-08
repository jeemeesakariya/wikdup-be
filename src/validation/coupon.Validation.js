const Joi = require('joi');

const couponSchema = {
  createCoupon: {
    body: Joi.object({
      code: Joi.string()
        .max(50)
        .required()
        .messages({
          'string.max': 'Coupon code must not exceed 50 characters.',
          'string.empty': 'Coupon code is required.',
          'any.required': 'Coupon code is required.'
        }),
      
      discount_type: Joi.string()
        .valid('percentage', 'flat')
        .required()
        .messages({
          'any.only': 'Discount type must be either "percentage" or "flat".',
          'any.required': 'Discount type is required.'
        }),
      
      discount_value: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
          'number.positive': 'Discount value must be a positive number.',
          'any.required': 'Discount value is required.'
        }),
      
      valid_from: Joi.date()
        .required()
        .messages({
          'date.base': 'Valid from must be a valid date.',
          'any.required': 'Valid from date is required.'
        }),
      
      valid_till: Joi.date()
        .required()
        .messages({
          'date.base': 'Valid till must be a valid date.',
          'any.required': 'Valid till date is required.'
        }),
      
      usage_limit: Joi.number()
        .integer()
        .min(1)
        .optional()
        .default(1)
        .messages({
          'number.base': 'Usage limit must be a number.',
          'number.integer': 'Usage limit must be an integer.',
          'number.min': 'Usage limit must be at least 1.'
        })
    })
  },
  
  getCouponById: {
    params: Joi.object({
      id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
          'number.base': 'Coupon ID must be a number.',
          'number.integer': 'Coupon ID must be an integer.',
          'number.positive': 'Coupon ID must be positive.',
          'any.required': 'Coupon ID is required.'
        })
    })
  }
};

module.exports = {
  couponSchema
};
