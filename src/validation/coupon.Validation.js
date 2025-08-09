const Joi = require('joi');
const { param } = require('../routes/coupon.Routes');

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
  .min(0)
  .positive()
  .precision(2)
  .when('discount_type', {
    is: 'percentage',
    then: Joi.number().min(0).max(100).precision(2).messages({
      'number.max': 'Discount value cannot exceed 100 when type is percentage.',
      'number.min': 'Discount value must be at least 0.'
    }),
    otherwise: Joi.number().min(0).precision(2).messages({
      'number.min': 'Discount value must be at least 0.'
    })
  })
  .messages({
    'number.positive': 'Discount value must be a positive number.'
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

      status: Joi.string()
        .valid('active', 'inactive', 'expired', 'paused')
        .default('active')
        .messages({
          'any.only': 'Status must be one of "active", "inactive", "expired", or "paused".'
        }),
    })
  },
  
  getCoupons: {
    params: Joi.object({
      id: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
          'number.base': 'Coupon ID must be a number.',
          'number.integer': 'Coupon ID must be an integer.',
          'number.positive': 'Coupon ID must be positive.',
        })
    })
  },

  updateCoupon: {
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
  }),
  body: Joi.object({
    code: Joi.string()
      .max(50)
      .messages({
        'string.max': 'Coupon code must not exceed 50 characters.',
        'string.empty': 'Coupon code cannot be empty.'
      }),
    discount_type: Joi.string()
        .valid('percentage', 'flat')
        .required()
        .messages({
          'any.only': 'Discount type must be either "percentage" or "flat".',
          'any.required': 'Discount type is required.'
        }),
   discount_value: Joi.number()
  .min(0)
  .positive()
  .precision(2)
  .when('discount_type', {
    is: 'percentage',
    then: Joi.number().min(0).max(100).precision(2).messages({
      'number.max': 'Discount value cannot exceed 100 when type is percentage.',
      'number.min': 'Discount value must be at least 0.'
    }),
    otherwise: Joi.number().min(0).precision(2).messages({
      'number.min': 'Discount value must be at least 0.'
    })
  })
  .messages({
    'number.positive': 'Discount value must be a positive number.'
  }),


    valid_from: Joi.date()
    .messages({
    'date.base': 'Valid from must be a valid date.',
    'date.less': 'Valid from date must be earlier than valid till date.'
  }),

    valid_till: Joi.date()
    .messages({
    'date.base': 'Valid till must be a valid date.'
    }),


    status: Joi.string()
      .valid('active', 'inactive', 'expired', 'paused')
      .messages({
        'any.only': 'Status must be one of "active", "inactive", "expired", or "paused".'
      })
  })
}


};

module.exports = {
  couponSchema
};