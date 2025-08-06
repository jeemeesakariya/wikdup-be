const express = require('express');
const authRoute = require('./routes/auth.Routes');
const userRoute = require('./routes/user.Routes');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./swagger');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
