const joi = require('joi');
const { registerHandler } = require('../controllers/auth.controller');

const authSchema = {
    login: {
        body: joi.object({
            email: joi.string().email()
                .messages({
                    'string.email': 'Invalid email format.',
                    'string.empty': 'Email is required.'
                }),

            mobile: joi.string().pattern(/^\d{10}$/)
                .messages({
                    'string.pattern.base': 'Mobile number must be exactly 10 digits.',
                    'string.empty': 'Mobile number is required.'
                }),

            password: joi.string().min(8)
                .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/)
                .required()
                .messages({
                    'string.min': 'Password must be at least 8 characters long.',
                    'string.pattern.base':
                        'Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.',
                    'string.empty': 'Password is required.'
                }),
        })

            .or('email', 'mobile')
            .messages({
                'object.missing': 'Either email or mobile is required.'
            }),
    },

    register: {
        body: joi.object({
            full_name: joi.string().min(2).max(100).required()
                .messages({
                    'string.base': 'Full name must be a string.',
                    'string.empty': 'Full name is required.'
                }),
            mobile: joi.string().pattern(/^\d{10}$/).required()
                .messages({
                    'string.pattern.base': 'Mobile number must be exactly 10 digits.',
                    'string.empty': 'Mobile number is required.'
                }),
            email: joi.string().email().required()
                .messages({
                    'string.email': 'Invalid email format.',
                    'string.empty': 'Email is required.'
                }),
            password: joi.string().min(8)
                .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/)
                .required()
                .messages({
                    'string.min': 'Password must be at least 8 characters long.',
                    'string.pattern.base':
                        'Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.',
                    'string.empty': 'Password is required.'
                })
        })
    }
}

module.exports = { authSchema };
