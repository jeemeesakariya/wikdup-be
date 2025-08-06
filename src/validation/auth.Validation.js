const Joi = require('joi');


const authSchema = {
    requestOtp: {
        body: Joi.object({
            email: Joi.string().email()
                .messages({
                    'string.email': 'Invalid email format.',
                    'string.empty': 'Email is required.'
                }),

            mobile: Joi.string().pattern(/^\d{10}$/)
                .messages({
                    'string.pattern.base': 'Mobile number must be exactly 10 digits.',
                    'string.empty': 'Mobile number is required.'
                }),

            password: Joi.string().min(8)
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
    login: {
        body: Joi.object({
            email: Joi.string().email()
                .messages({
                    'string.email': 'Invalid email format.',
                    'string.empty': 'Email is required.'
                }),

            mobile: Joi.string().pattern(/^\d{10}$/)
                .messages({
                    'string.pattern.base': 'Mobile number must be exactly 10 digits.',
                    'string.empty': 'Mobile number is required.'
                }),

            otp: Joi.string()
                .pattern(/^[0-9]{6}$/)
                .required()
                .messages({
                    'string.pattern.base': 'OTP must be a 6-digit number.',
                    'string.empty': 'OTP is required.',
                    'any.required': 'OTP is required.',
                }),
        })

            .or('email', 'mobile')
            .messages({
                'object.missing': 'Either email or mobile is required.'
            }),
    },

    register: {
        body: Joi.object({
            full_name: Joi.string().min(2).max(100).required()
                .messages({
                    'string.base': 'Full name must be a string.',
                    'string.empty': 'Full name is required.'
                }),
            mobile: Joi.string().pattern(/^\d{10}$/).required()
                .messages({
                    'string.pattern.base': 'Mobile number must be exactly 10 digits.',
                    'string.empty': 'Mobile number is required.'
                }),
            email: Joi.string().email().required()
                .messages({
                    'string.email': 'Invalid email format.',
                    'string.empty': 'Email is required.'
                }),
            password: Joi.string().min(8)
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
