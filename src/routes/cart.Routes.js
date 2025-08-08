const express = require('express');

const router = express.Router();

router.get('/', () => {});

router.get('/total', () => {});

router.post('/items', () => {});

router.put('/items/:itemId', () => {});

router.delete('/items/:itemId', () => {});

router.post('/apply-coupon', () => {});

router.delete('/remove-coupon', () => {});

module.exports = router;
