const express = require('express');
const router = express.Router();

const {auth, isAdmin, isEmployee} = require('../middleware/auth');

const userControllers = require('../controllers/userControllers');

router.use(auth);


router.route('/') 
    .get(isAdmin, userControllers.getAllUsers) 




router.route('/manage/customer')
    .post(isEmployee, userControllers.createNewCustomer) 
    .get(isEmployee, userControllers.getAllCustomers); 

router.route('/manage/customer/:id')
    .get(isEmployee, userControllers.getCustomer) 
    .put(isEmployee, userControllers.updateCustomer) 
    .delete(isEmployee, userControllers.deleteCustomer) 




 
router.route('/employee')
    .get(isAdmin, userControllers.getAllEmployees)
    .post(isAdmin, userControllers.createNewEmployee)

router.route('/employee/:id')
    .get(isEmployee, userControllers.getEmployee)
    .put(isAdmin, userControllers.updateEmployee)
    .delete(isAdmin, userControllers.deleteEmployee)

module.exports = router;