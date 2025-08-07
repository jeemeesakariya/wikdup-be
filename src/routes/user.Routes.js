const express = require('express');
const { createAndUpdateUserHandler  , getAllUsersHandler, deleteUserHandler} = require('../controllers/user.controller');
const { validater } = require("../common/helper");
const { userValidationSchema } = require("../validation/user.Validation")
const {auth, hasePermission} =  require("../common/helper");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         full_name:
 *           type: string
 *         mobile:
 *           type: string
 *         email:
 *           type: string
 *         password_hash:
 *           type: string
 *         role_id:
 *           type: integer
 *         is_deleted:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         created_by:
 *           type: integer
 *         updated_at:
 *           type: string
 *           format: date-time
 *         updated_by:
 *           type: integer
 */


/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/',auth,hasePermission("Superadmin ", "Admin"), getAllUsersHandler);

// /**
//  * @swagger
//  * /api/v1/user:
//  *   post:
//  *     summary: Create a new user
//  *     tags: [User]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - full_name
//  *               - mobile
//  *               - email
//  *               - password
//  *               - role_id
//  *             properties:
//  *               full_name:
//  *                 type: string
//  *                 example: Jeemee Sakariya
//  *               mobile:
//  *                 type: string
//  *                 example: "9876543219"
//  *               email:
//  *                 type: string
//  *                 example: jeemeesakariya1@example.com
//  *               password:
//  *                 type: string
//  *                 example: Test@1234
//  *               role_id:
//  *                 type: integer
//  *                 example: 1
//  *     responses:
//  *       200:
//  *         description: User created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 statusCode:
//  *                   type: integer
//  *                   example: 200
//  *                 message:
//  *                   type: string
//  *                   example: User created successfully
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: integer
//  *                       example: 4
//  *                     full_name:
//  *                       type: string
//  *                       example: Jeemee Sakariya
//  *                     mobile:
//  *                       type: string
//  *                       example: "9876543217"
//  *                     email:
//  *                       type: string
//  *                       example: jeemeesakariya2@example.com
//  *                     password:
//  *                       type: string
//  *                       example: $2b$10$MbpWOpcjEjF.56HJXUcyQ.K/GBQjdAiFKxlHFfjr2clGxVwoLoOXe
//  *                     role_id:
//  *                       type: integer
//  *                       example: 1
//  *                     is_deleted:
//  *                       type: boolean
//  *                       example: false
//  *                     created_at:
//  *                       type: string
//  *                       format: date-time
//  *                       example: 2025-08-05T12:18:49.000Z
//  *                     created_by:
//  *                       type: string
//  *                       nullable: true
//  *                       example: null
//  *                     updated_at:
//  *                       type: string
//  *                       format: date-time
//  *                       example: 2025-08-05T12:18:49.000Z
//  *                     updated_by:
//  *                       type: string
//  *                       nullable: true
//  *                       example: null
//  *       400:
//  *         description: Bad Request - User already exists
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 statusCode:
//  *                   type: integer
//  *                   example: 400
//  *                 message:
//  *                   type: string
//  *                   example: User already exists
//  *                 data:
//  *                   type: array
//  *                   example: []
//  */
// router.post('/',validater(userValidationSchema.createAndUpdateUser), createAndUpdateUserHandler);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - mobile
 *               - email
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Jeemee Sakariya
 *               mobile:
 *                 type: string
 *                 example: "9876543219"
 *               email:
 *                 type: string
 *                 example: jeemeesakariya1@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     full_name:
 *                       type: string
 *                       example: Jeemee Sakariya
 *                     mobile:
 *                       type: string
 *                       example: "9876543219"
 *                     email:
 *                       type: string
 *                       example: jeemeesakariya1@example.com
 *                     password:
 *                       type: string
 *                       example: $2b$10$c.K3DmZkAu/I7eJhUGwIeOcZILzaWYv8dQiLHcyJ568DY0bWbjYpu
 *                     role_id:
 *                       type: integer
 *                       example: 1
 *                     is_deleted:
 *                       type: boolean
 *                       example: false
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-08-05T11:06:02.000Z
 *                     created_by:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-08-05T11:49:24.000Z
 *                     updated_by:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *       400:
 *         description: Bad Request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["body: \"email\" is required"]
 *                 data:
 *                   type: array
 *                   example: []
 */
router.put('/:id',auth,hasePermission("Superadmin", "Admin"), validater(userValidationSchema.createAndUpdateUser), createAndUpdateUserHandler );

/**
 * @swagger
 * /api/v1/user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *                 data:
 *                   type: array
 *                   example: []
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 data:
 *                   type: array
 *                   example: []
 */
router.delete('/:id',auth, hasePermission("Superadmin", "Admin"), validater(userValidationSchema.deleteUser), deleteUserHandler);

module.exports = router;    
