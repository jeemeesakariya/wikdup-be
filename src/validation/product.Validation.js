const Joi = require('joi');

const productSchema = {
    createProduct: {
        body: Joi.object({
            sku_id: Joi.number().integer().positive().required()
                .messages({
                    'number.base': 'SKU ID must be a number.',
                    'number.integer': 'SKU ID must be an integer.',
                    'number.positive': 'SKU ID must be a positive number.',
                    'any.required': 'SKU ID is required.'
                }),

            product_name: Joi.string().min(2).max(255).required()
                .messages({
                    'string.base': 'Product name must be a string.',
                    'string.min': 'Product name must be at least 2 characters long.',
                    'string.max': 'Product name cannot exceed 255 characters.',
                    'any.required': 'Product name is required.'
                }),

            mrp: Joi.number().positive().precision(2).required()
                .messages({
                    'number.base': 'MRP must be a number.',
                    'number.positive': 'MRP must be a positive number.',
                    'any.required': 'MRP is required.'
                }),

            cost_price: Joi.number().positive().precision(2).required()
                .messages({
                    'number.base': 'Cost price must be a number.',
                    'number.positive': 'Cost price must be a positive number.',
                    'any.required': 'Cost price is required.'
                }),

            gst_percent: Joi.number().min(0).max(100).precision(2).required()
                .messages({
                    'number.base': 'GST percent must be a number.',
                    'number.min': 'GST percent cannot be negative.',
                    'number.max': 'GST percent cannot exceed 100.',
                    'any.required': 'GST percent is required.'
                }),

            packaging_type: Joi.string().max(100).optional()
                .messages({
                    'string.base': 'Packaging type must be a string.',
                    'string.max': 'Packaging type cannot exceed 100 characters.'
                }),

            images: Joi.array().items(
                Joi.string().uri().max(500)
                    .messages({
                        'string.base': 'Image URL must be a string.',
                        'string.uri': 'Image URL must be a valid URL.',
                        'string.max': 'Image URL cannot exceed 500 characters.'
                    })
            ).min(1).max(10).optional()
                .messages({
                    'array.base': 'Images must be an array.',
                    'array.min': 'At least one image is required if images array is provided.',
                    'array.max': 'Cannot upload more than 10 images.'
                })
        })
    },

    updateProduct: {
        params: Joi.object({
            id: Joi.number().integer().positive().required()
                .messages({
                    'number.base': 'Product ID must be a number.',
                    'number.integer': 'Product ID must be an integer.',
                    'number.positive': 'Product ID must be a positive number.',
                    'any.required': 'Product ID is required.'
                })
        }),

        body: Joi.object({
            sku_id: Joi.number().integer().positive().optional()
                .messages({
                    'number.base': 'SKU ID must be a number.',
                    'number.integer': 'SKU ID must be an integer.',
                    'number.positive': 'SKU ID must be a positive number.'
                }),

            product_name: Joi.string().min(2).max(255).optional()
                .messages({
                    'string.base': 'Product name must be a string.',
                    'string.min': 'Product name must be at least 2 characters long.',
                    'string.max': 'Product name cannot exceed 255 characters.'
                }),

            mrp: Joi.number().positive().precision(2).optional()
                .messages({
                    'number.base': 'MRP must be a number.',
                    'number.positive': 'MRP must be a positive number.'
                }),

            cost_price: Joi.number().positive().precision(2).optional()
                .messages({
                    'number.base': 'Cost price must be a number.',
                    'number.positive': 'Cost price must be a positive number.'
                }),

            gst_percent: Joi.number().min(0).max(100).precision(2).optional()
                .messages({
                    'number.base': 'GST percent must be a number.',
                    'number.min': 'GST percent cannot be negative.',
                    'number.max': 'GST percent cannot exceed 100.'
                }),

            packaging_type: Joi.string().max(100).optional()
                .messages({
                    'string.base': 'Packaging type must be a string.',
                    'string.max': 'Packaging type cannot exceed 100 characters.'
                }),

            is_active: Joi.boolean().optional()
                .messages({
                    'boolean.base': 'is_active must be a boolean value.'
                }),

            approval_status: Joi.string().valid('P', 'A', 'R').optional()
                .messages({
                    'string.base': 'Approval status must be a string.',
                    'any.only': 'Approval status must be P (Pending), A (Approved), or R (Rejected).'
                }),

            approved_by: Joi.number().integer().positive().allow(null).optional()
                .messages({
                    'number.base': 'Approved by must be a number.',
                    'number.integer': 'Approved by must be an integer.',
                    'number.positive': 'Approved by must be a positive number.'
                }),

            is_deleted: Joi.boolean().optional()
                .messages({
                    'boolean.base': 'is_deleted must be a boolean value.'
                }),

            images: Joi.array().items(
                Joi.string().uri().max(500)
                    .messages({
                        'string.base': 'Image URL must be a string.',
                        'string.uri': 'Image URL must be a valid URL.',
                        'string.max': 'Image URL cannot exceed 500 characters.'
                    })
            ).min(1).max(10).optional()
                .messages({
                    'array.base': 'Images must be an array.',
                    'array.min': 'At least one image is required if images array is provided.',
                    'array.max': 'Cannot upload more than 10 images.'
                })
        }).min(1)
            .messages({
                'object.min': 'At least one field must be provided for update.'
            })
    },

    deleteProduct: {
        params: Joi.object({
            id: Joi.number().integer().positive().required()
                .messages({
                    'number.base': 'Product ID must be a number.',
                    'number.integer': 'Product ID must be an integer.',
                    'number.positive': 'Product ID must be a positive number.',
                    'any.required': 'Product ID is required.'
                })
        })
    },

    getPendingProducts: {
        query: Joi.object({
            page: Joi.number().integer().min(1).optional().default(1)
                .messages({
                    'number.base': 'Page must be a number.',
                    'number.integer': 'Page must be an integer.',
                    'number.min': 'Page must be at least 1.'
                }),
            limit: Joi.number().integer().min(1).max(100).optional().default(10)
                .messages({
                    'number.base': 'Limit must be a number.',
                    'number.integer': 'Limit must be an integer.',
                    'number.min': 'Limit must be at least 1.',
                    'number.max': 'Limit cannot exceed 100.'
                })
        })
    },

    getActiveProducts: {
        query: Joi.object({
            page: Joi.number().integer().min(1).optional().default(1)
                .messages({
                    'number.base': 'Page must be a number.',
                    'number.integer': 'Page must be an integer.',
                    'number.min': 'Page must be at least 1.'
                }),
            limit: Joi.number().integer().min(1).max(100).optional().default(10)
                .messages({
                    'number.base': 'Limit must be a number.',
                    'number.integer': 'Limit must be an integer.',
                    'number.min': 'Limit must be at least 1.',
                    'number.max': 'Limit cannot exceed 100.'
                })
        })
    }
};

module.exports = productSchema;
