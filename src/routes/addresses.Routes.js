const express = require('express');
const {
  getAllAddressesHandler,
  createAddressHandler,
  updateAddressHandler,
  deleteAddressHandler,
} = require('../controllers/addresses.Controllers');
const { addressSchema } = require('../validation/address.Validation');
const { validater } = require('../common/helper');

const router = express.Router();

router.get('/', validater(addressSchema.getAllAddresses), getAllAddressesHandler);

router.post('/', validater(addressSchema.createAddress), createAddressHandler);

router.put('/:id', validater(addressSchema.updateAddress), updateAddressHandler);

router.delete('/:id',validater(addressSchema.deleteAddress), deleteAddressHandler);

module.exports = router;
