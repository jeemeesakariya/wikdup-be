const { sendResponse } = require('../common/helper');
const { StatusCodes } = require('http-status-codes');
const bcryptjs = require("bcryptjs");
const knex = require("../config/db");

const getAllUsersHandler = async (req, res) => {
    try {
        const users = await knex('user_master_data').select('*');

        if(users.length === 0) {
            return sendResponse({
                res,
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: "Users not found"
            })
        }

        return sendResponse({
            res,
            success: true,
            statusCode: StatusCodes.OK,
            message: "Users fetched successfully",
            data: users
        });
        
    } catch (err) {
        console.log(err);
        return sendResponse({
            res,
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Something went wrong"
        })
    }
}
const createUserHandler = async (req, res) => {
    try {
        const { full_name, mobile, email, password, role_id } = req.body;

        const isExists = await knex("user_master_data").where({ email}).orWhere({ mobile}).first();
        if (isExists) {
            return sendResponse({
                res,
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: "User already exists"
            })
        }

        const role = knex("roles").where({ id: role_id }).first();
        if (!role) {
            return sendResponse({
                res,
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: "Role not found"
            })
        }

        const hasePw = bcryptjs.hashSync(password, 10);

        const [id] = await knex("user_master_data").insert({
            full_name,
            mobile,
            email,
            password: hasePw,
            role_id
        });

        if (!id) {
            return sendResponse({
                res,
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Something went wrong"
            })
        }

        const user = await knex("user_master_data").where({ id }).first();  

        return sendResponse({
            res,
            success: true,
            statusCode: StatusCodes.OK,
            message: "User created successfully",
            data: user
        });

        
    } catch (err) {
        console.log(err);
        return sendResponse({
            res,
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: err.message
        })
    }
}
const updateUserHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, mobile, email } = req.body;

        const isExists = await knex("user_master_data").where({ id }).first();
        if (!isExists) {
            return sendResponse({
                res,
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: "User not found"
            })
        }

        await knex("user_master_data").where({ id }).update({
            full_name,
            mobile,
            email
        });

        const newUser = await knex("user_master_data").where({ id }).first();

        return sendResponse({
            res,
            success: true,
            statusCode: StatusCodes.OK,
            message: "User updated successfully",
            data: newUser
        })
        
    } catch (err) {
        console.log(err);
            return sendResponse({
            res,    
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: err.message
        })
    }
}
const deleteUserHandler = async (req, res) => {
    try {
        const { id } = req.params;

        const isExists = await knex("user_master_data").where({ id }).first();
        if (!isExists) {
            return sendResponse({
                res,
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: "User not found"
            })
        }

        await knex("user_master_data").where({ id }).del();

        return sendResponse({
            res,
            success: true,
            statusCode: StatusCodes.OK,
            message: "User deleted successfully"
        });
    } catch (err) {
        console.log(err);
            return sendResponse({
            res,    
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: err.message
        })
    }
}

module.exports = {
    getAllUsersHandler,
    createUserHandler,
    updateUserHandler,
    deleteUserHandler
}