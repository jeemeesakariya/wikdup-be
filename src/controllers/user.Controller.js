const { sendResponse } = require('../common/helper');
const statuscode = require('../common/statuscode');
const bcryptjs = require('bcryptjs');
const knex = require('../config/db');

const getAllUsersHandler = async (req, res) => {
  try {
    const users = await knex('user_master_data')
      .leftJoin('roles', 'user_master_data.role_id', 'roles.id')
      .where('user_master_data.is_deleted', 0)
      .select(
        'user_master_data.id',
        'user_master_data.full_name',
        'user_master_data.mobile',
        'user_master_data.email',
        'user_master_data.role_id',
        'roles.role_name',
        'user_master_data.created_at',
        'user_master_data.updated_at',
        'user_master_data.created_by',
        'user_master_data.updated_by'
      );

    if (users.length === 0) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'Users not found',
      });
    }

    return sendResponse({
      res,
      success: true,
      statusCode:statuscode.R_SUCCESS,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (err) {
    console.log(err);
    return sendResponse({
      res,
      success: false,
      statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
    });
  }
};
const createUserHandler = async (req, res) => {
  try {
    const loginUser= req.user; // fallback to 1 if not available
    const { full_name, mobile, email, password, role_id,  } = req.body;

    // roleid validation
    if (!role_id) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'Role ID is required',
      });
    }

    // password validation
    if (!password) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'Password is required',
      });
    }

    const isExists = await knex('user_master_data').where({ email }).orWhere({ mobile }).first();
    if (isExists) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_DATA_EXISTS,
        message: 'User already exists',
      });
    }

    const role = knex('roles').where({ id: role_id }).first();
    if (!role) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'Role not found',
      });
    }

    const hasePw = bcryptjs.hashSync(password, 10);

    const [id] = await knex('user_master_data').insert({
      full_name,
      mobile,
      email,
      password: hasePw,
      role_id,
      created_by: loginUser?.id,
    });

    if (!id) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
      });
    }

    const user = await knex('user_master_data')
      .where({ id })
      .select(
        'id',
        'full_name',
        'mobile',
        'email',
        'role_id',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by'
      )
      .first();

    return sendResponse({
      res,
      success: true,
      statusCode:statuscode.R_SUCCESS,
      message: 'User created successfully',
      data: user,
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
const createAndUpdateUserHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const loginUser = req.user; // fallback to 1 if not available
    if (id == 0) return createUserHandler(req, res);

    const { full_name, mobile, email } = req.body;

    const isExists = await knex('user_master_data').where({ id }).first();
    if (!isExists) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'User not found',
      });
    }

    // check mobile or email alredy exxest or not
    const isDuplicate = await knex('user_master_data')
      .where((builder) => {
        builder.where('email', email).orWhere('mobile', mobile);
      })
      .andWhere('id', '!=', id)
      .first();

    if (isDuplicate) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_DATA_EXISTS,
        message: 'Duplicate mobile or email found',
      });
    }

    await knex('user_master_data').where({ id }).update({
      full_name,
      mobile,
      email,
      updated_by: loginUser?.id,
    });

    const newUser = await knex('user_master_data')
      .where({ id })
      .select(
        'id',
        'full_name',
        'mobile',
        'email',
        'role_id',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by'
      )
      .first();

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'User updated successfully',
      data: newUser,
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
const deleteUserHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const isExists = await knex('user_master_data').where({ id }).where('is_deleted', 0).first();
    if (!isExists) {
      return sendResponse({
        res,
        success: false,
        statusCode: statuscode.R_NOT_FOUND,
        message: 'User not found',
      });
    }

    await knex('user_master_data').where({ id }).update('is_deleted', 1);

    return sendResponse({
      res,
      success: true,
      statusCode: statuscode.R_SUCCESS,
      message: 'User deleted successfully',
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

module.exports = {
  getAllUsersHandler,
  createAndUpdateUserHandler,
  deleteUserHandler,
};
