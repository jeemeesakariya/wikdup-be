const express = require('express');
const {
  createProductController,
  updateProductController,
  deleteProductController,
  getPendingProductsController,
  getActiveProductsController,
} = require('../controllers/product.Controller');
const { validater } = require('../common/helper');
const productSchema = require('../validation/product.Validation');
const { auth, hasPermission } = require('../common/helper');

const router = express.Router();

router.post(
  '/create',
  auth,
  hasPermission('Superadmin', 'Admin'),
  validater(productSchema.createProduct),
  createProductController
);

router.put(
  '/update/:id',
  auth,
  hasPermission('Superadmin', 'Admin'),
  validater(productSchema.updateProduct),
  updateProductController
);

router.delete(
  '/delete/:id',
  auth,
  hasPermission('Superadmin', 'Admin'),
  validater(productSchema.deleteProduct),
  deleteProductController
);

router.get(
  '/pending',
  auth,
  hasPermission('Superadmin', 'Admin'),
  validater(productSchema.getPendingProducts),
  getPendingProductsController
);

router.get(
  '/list',
  auth,
  hasPermission('Superadmin', 'Admin'),
  validater(productSchema.getActiveProducts),
  getActiveProductsController
);

module.exports = router;
