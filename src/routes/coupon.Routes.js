const express = require('express');
const {
  createCoupon,
  getCouponById,
} = require('../controllers/coupon.Controllers');
const { validater, auth, hasPermission } = require('../common/helper');
const { couponSchema } = require('../validation/coupon.Validation');

const router = express.Router();

// POST /coupons - Create a new coupon (Superadmin only)
router.post('/', auth, hasPermission('Superadmin'), validater(couponSchema.createCoupon), createCoupon);

// GET /coupons/:id - Get coupon by ID (Superadmin only)
router.get('/:id', auth, hasPermission('Superadmin'), validater(couponSchema.getCouponById), getCouponById);

module.exports = router;
