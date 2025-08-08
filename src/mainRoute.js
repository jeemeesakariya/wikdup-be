const express = require('express');
const authRoute = require('./routes/auth.Routes');
const userRoute = require('./routes/user.Routes');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./swagger');
const productRoute = require('./routes/product.Routes');
const cartRoute = require('./routes/cart.Routes');
const addressesRoute = require('./routes/addresses.Routes');
const couponRoute = require('./routes/coupon.Routes');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/products', productRoute);
router.use('/cart',cartRoute)
router.use('/addresses',addressesRoute)
router.use('/coupons', couponRoute);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
