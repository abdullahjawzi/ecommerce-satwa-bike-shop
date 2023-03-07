const express = require('express');
const router = express.Router();

const {auth, isEmployee} = require('../middleware/auth');

const orderControllers = require('../controllers/orderControllers');

router.use(auth);



router.route('/inplace')
    .post(isEmployee, orderControllers.createNewInplaceOrder) 

router.route('/inplace/employee/:id')
    .get(isEmployee, orderControllers.getAllEmployeeInplaceOrders) 

router.route('/inplace/customer/:id')
    .get(orderControllers.getAllCustomerInplaceOrders) 

router.route('/inplace/:id')
    .get(isEmployee, orderControllers.getInplaceOrder)
    .put(isEmployee, orderControllers.updateInplaceOrder)
    .delete(isEmployee , orderControllers.deleteInplaceOrder)




router.route('/online-service')
    .post(orderControllers.createNewOnlineServiceOrder) 

router.route('/online-service/customer/:id')
    .get(orderControllers.getAllCustomerServiceOrders) 

router.route('/online-service/employee/available')
    .get(isEmployee, orderControllers.getAllAvailableServiceOrders);

router.route('/online-service/employee/accept')
    .put(isEmployee, orderControllers.updateServiceOrderAcceptStatus);

router.route('/online-service/employee/update/:id')
    .put(isEmployee, orderControllers.updateServiceOrderPriceAndCompletion);

router.route('/online-service/:id')
    .get(orderControllers.getSingleServiceOrder) 
    .put(orderControllers.updateServiceOrder) 




router.route('/online-purchase')
    .get(isEmployee, orderControllers.getAllPurchaseOrders)
    .post(orderControllers.createNewOnlinePurchaseOrder) 

router.route('/online-purchase/customer')
    .get(orderControllers.getLoggedInUserPurchaseOrders) 

router.route('/online-purchase/:id')
    .get(orderControllers.getSinglePurchaseOrder);

router.route('/online-purchase/:id/pay')
    .put(orderControllers.updatePurchaseOrderPaidStatus)

router.route('/online-purchase/:id/status')
    .put(isEmployee, orderControllers.updatePurchaseOrderStatus)





router.route('/employee/my/sales/:id')
    .get(isEmployee, orderControllers.getAllEmployeeSalesOrders);



module.exports = router;