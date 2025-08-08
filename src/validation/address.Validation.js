const joi = require('joi');

const addressSchema = {
  getAllAddresses: {
    query: joi.object({
      user_id: joi.number().integer().min(1).required().messages({
        'number.base': 'User ID must be a number.',
        'number.min': 'User ID must be at least 1.',
        'number.empty': 'User ID is required.',
      }),
    }),
  },

  createAddress: {
    body: joi.object({
      user_id: joi.number().integer().min(1).required().messages({
        'number.base': 'User ID must be a number.',
        'number.min': 'User ID must be at least 1.',
        'number.empty': 'User ID is required.',
      }),

      address_line1: joi.string().min(2).max(255).required().messages({
        'string.base': 'Address line 1 must be a string.',
        'string.min': 'Address line 1 must be at least 2 characters long.',
        'string.max': 'Address line 1 cannot exceed 255 characters.',
        'string.empty': 'Address line 1 is required.',
      }),

      address_line2: joi.string().max(255).optional().messages({
        'string.base': 'Address line 2 must be a string.',
        'string.max': 'Address line 2 cannot exceed 255 characters.',
      }),

      city: joi.string().min(2).max(100).required().messages({
        'string.base': 'City must be a string.',
        'string.min': 'City must be at least 2 characters long.',
        'string.max': 'City cannot exceed 100 characters.',
        'string.empty': 'City is required.',
      }),

      state: joi.string().min(2).max(100).required().messages({
        'string.base': 'State must be a string.',
        'string.min': 'State must be at least 2 characters long.',
        'string.max': 'State cannot exceed 100 characters.',
        'string.empty': 'State is required.',
      }),

      pincode: joi.string().min(6).max(6).required().messages({
        'string.base': 'Pincode must be a string.',
        'string.min': 'Pincode must be at least 6 characters long.',
        'string.max': 'Pincode cannot exceed 6 characters.',
        'string.empty': 'Pincode is required.',
      }),

      country: joi.string().min(2).max(100).optional().messages({
        'string.base': 'Country must be a string.',
        'string.min': 'Country must be at least 2 characters long.',
        'string.max': 'Country cannot exceed 100 characters.',
      }),
    }),
  },

  updateAddress: {
    params: joi.object({
      id: joi.number().integer().min(0).required().messages({
        'number.base': 'Address ID must be a number.',
        'number.empty': 'Address ID is required.',
      }),
    }),
    body: joi.object({
      user_id: joi.number().integer().min(1).required().messages({
        'number.base': 'User ID must be a number.',
        'number.min': 'User ID must be at least 1.',
        'number.empty': 'User ID is required.',
      }),

      address_line1: joi.string().min(2).max(255).optional().messages({
        'string.base': 'Address line 1 must be a string.',
        'string.min': 'Address line 1 must be at least 2 characters long.',
        'string.max': 'Address line 1 cannot exceed 255 characters.',
      }),

      address_line2: joi.string().max(255).optional().messages({
        'string.base': 'Address line 2 must be a string.',
        'string.max': 'Address line 2 cannot exceed 255 characters.',
      }),

      city: joi.string().min(2).max(100).optional().messages({
        'string.base': 'City must be a string.',
        'string.min': 'City must be at least 2 characters long.',
        'string.max': 'City cannot exceed 100 characters.',
      }),

      state: joi.string().min(2).max(100).optional().messages({
        'string.base': 'State must be a string.',
        'string.min': 'State must be at least 2 characters long.',
        'string.max': 'State cannot exceed 100 characters.',
      }),

      pincode: joi.string().min(6).max(6).optional().messages({
        'string.base': 'Pincode must be a string.',
        'string.min': 'Pincode must be at least 6 characters long.',
        'string.max': 'Pincode cannot exceed 6 characters.',
      }),

      country: joi.string().min(2).max(100).optional().messages({
        'string.base': 'Country must be a string.',
        'string.min': 'Country must be at least 2 characters long.',
        'string.max': 'Country cannot exceed 100 characters.',
      }),
    }),
  },

  deleteAddress: {
    params: joi.object({
      id: joi.number().integer().min(0).required().messages({
        'number.base': 'Address ID must be a number.',
        'number.empty': 'Address ID is required.',
      }),
    }),
  },
};

module.exports = { addressSchema };
