const express = require('express');
const {
  getCartHandler,
  createCartItemHandler,
  updateCartItemHandler,
  deleteCartItemHandler,
  applyCouponHandler,
  deleteCouponHandler,
} = require('../controllers/cart.Controllers');
const { validater, auth } = require('../common/helper');
const { cartItemSchema } = require('../validation/cart.Validation');

const router = express.Router();

// cart items
router.get('/items', auth, getCartHandler);
router.post('/items', auth, validater(cartItemSchema.createCartItem), createCartItemHandler);
router.put(
  '/items/:cartItemId',
  auth,
  validater(cartItemSchema.updateCartItem),
  updateCartItemHandler
);
router.delete(
  '/items/:cartItemId',
  auth,
  validater(cartItemSchema.deleteCartItem),
  deleteCartItemHandler
);

// cart coupon
router.post('/apply-coupon', () => {});
router.delete('/remove-coupon/:cartId', () => {});

// cart total
router.get('/total', () => {});

module.exports = router;
