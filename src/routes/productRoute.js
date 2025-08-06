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
const {auth} =require('../common/helper')

const router = express.Router();

router.post('/create', 
  auth,
  validater(productSchema.createProduct), 
  createProductController
);

router.put('/update/:id', 
  auth,
  validater(productSchema.updateProduct), 
  updateProductController
);

router.delete('/delete/:id', 
  auth,
  validater(productSchema.deleteProduct), 
  deleteProductController
);

router.get('/pending', 
  auth,
//   validater(productSchema.getPendingProducts), 
  getPendingProductsController
);

router.get('/list', 
  auth,
  validater(productSchema.getActiveProducts), 
  getActiveProductsController
);

module.exports = router;
