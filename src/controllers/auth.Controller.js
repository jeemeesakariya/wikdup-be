const { StatusCodes } = require("http-status-codes");
const sendResponse = require("../common/helper");
const bcryptjs = require("bcryptjs");
const knex = require("../config/db");

const loginHandler = async (req, res) => {
    try {


        
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

const registerHandler = async (req, res) => {
    try {

        const { full_name, mobile, email, password } = req.body;

        const isExists = await knex("user_master_data").where({ email }).orWhere({ mobile }).first();
        if (isExists) {
            return sendResponse({
                res,
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: "User already exists"
            })
        }

        const hasePw = bcryptjs.hashSync(password, 10);

        const [id] = await knex("user_master_data").insert({
            full_name,
            mobile,
            email,
            password: hasePw,
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
            message: "User registed successfully",
            data: user
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

module.exports = {
    loginHandler,
    registerHandler
}