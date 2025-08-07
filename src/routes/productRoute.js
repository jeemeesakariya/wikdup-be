const express = require('express');
const { 
  createProductController, 
  updateProductController, 
  deleteProductController,
  getPendingProductsController,
  getActiveProductsController
} = require('../controllers/product.Controller');
const { validater } = require('../common/helper');
const productSchema = require('../validation/product.Validation');
const { auth, hasePermission } = require('../common/helper')


const router = express.Router();

router.post('/create', 
  auth,
  hasePermission("Superadmin", "Admin"),
  validater(productSchema.createProduct), 
  createProductController
);

router.put('/update/:id', 
  auth,
  hasePermission("Superadmin", "Admin"),
  validater(productSchema.updateProduct), 
  updateProductController
);

router.delete('/delete/:id', 
  auth,
  hasePermission("Superadmin", "Admin"),
  validater(productSchema.deleteProduct), 
  deleteProductController
);

router.get('/pending', 
  auth,
  hasePermission("Superadmin", "Admin"),
  validater(productSchema.getPendingProducts), 
  getPendingProductsController
);

router.get('/list', 
  auth,
  hasePermission("Superadmin", "Admin"),
  validater(productSchema.getActiveProducts), 
  getActiveProductsController
);

module.exports = router;
