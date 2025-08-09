const express = require('express');
const {
  createCoupon,
  getCoupons,
  updateCoupon
} = require('../controllers/coupon.Controllers');
const { validater, auth, hasPermission } = require('../common/helper');
const { couponSchema } = require('../validation/coupon.Validation');
const { up } = require('../../migrations/20250809110610_create_coupon_master_table');

const router = express.Router();

// POST /coupons - Create a new coupon (Superadmin only)
router.post('/', auth, hasPermission('Superadmin'), validater(couponSchema.createCoupon), createCoupon);

// GET /coupons/:id - Get coupon by ID (Superadmin only)
router.get('/', auth, hasPermission('Superadmin'), validater(couponSchema.getCoupons), getCoupons);
router.put('/:id', auth, hasPermission('Superadmin'), validater(couponSchema.updateCoupon), updateCoupon);

module.exports = router;
