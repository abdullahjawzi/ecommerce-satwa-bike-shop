const express = require('express');
const router = express.Router();

const supplierControllers = require('../controllers/supplierControllers');

const {auth, isAdmin} = require('../middleware/auth');

router.use(auth, isAdmin);

router.route('/')
    .post(supplierControllers.createNewSupplier)
    .get(supplierControllers.getAllSuppliers)

router.route('/:id')
    .get(supplierControllers.getSupplier)
    .put(supplierControllers.updateSupplier)
    .delete(supplierControllers.removeSupplier)
    

module.exports = router;
