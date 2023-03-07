const express = require('express');
const router = express.Router();

const {auth, isAdmin, isEmployee} = require('../middleware/auth');

const productControllers = require('../controllers/productControllers');

router.use(auth);

router.route('/')
    .get(isAdmin, productControllers.getAllProducts)
    .post(isEmployee, productControllers.createNewProduct) 

router.route('/showroom')
    .get(productControllers.getAllShowroomProducts);

router.route('/cart-items')
    .get(productControllers.getAllCartProducts);

router.route('/:id')
    .get(productControllers.getProduct) 
    .put(isEmployee, productControllers.updateProduct) 
    .delete(isAdmin, productControllers.deleteProduct) 

router.route('/:id/images')
    .put(isEmployee, productControllers.updateProductImages)

router.route('/:id/switch/state')
    .put(isAdmin, productControllers.updateProductState)

module.exports = router;