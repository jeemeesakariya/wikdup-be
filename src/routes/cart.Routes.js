const express = require('express');

const router = express.Router();

//cart
router.get('/', () => {});
router.post('/', () => {});
router.delete('/', () => { });

// cart total
router.get('/total', () => {});

// cart items
router.get('/items', () => {});
router.post('/items', () => {});
router.put('/items/:itemId', () => {});
router.delete('/items/:itemId', () => {});

// cart coupon
router.post('/apply-coupon', () => {});
router.delete('/remove-coupon/:cartId', () => {});

module.exports = router;