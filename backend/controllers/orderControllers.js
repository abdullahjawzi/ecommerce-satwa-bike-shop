const OrderSchema = require('../models/Order');
const ProductSchema = require('../models/Product');



const createNewInplaceOrder = async (req, res, next) => {
    const {customer, description, price, status}  = req.body;

    if(!customer || !description || price <= 0 || !status) {
        return res.status(422).json({message: 'Invalid Input'});
    }

    const employeeId = req.user.id;

    const order = {
        type: 'inplace',
        customer,
        inplaceOrder: {
            description,
            price,
            handledBy: employeeId,
            status
        }
    }

    try {
        await OrderSchema.create(order);
        res.status(201).json({message: 'Inplace order created'});
    } catch (err) {
        next(err);
    }
}



const getAllEmployeeInplaceOrders = async (req, res, next) => {
    const employeeId = req.params.id;

    if(req.user.id.toString() !== employeeId.toString() && req.user.roles.indexOf('Admin') === -1) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        const orders = await OrderSchema.find({type: 'inplace', 'inplaceOrder.handledBy': employeeId}).lean().exec();

        res.status(200).json({message: 'Success', orders});
    } catch (err) {
        next(err);
    }
}



const getAllCustomerInplaceOrders = async (req, res, next) => {
    const customerId = req.params.id;

    if(req.user.id.toString() !== customerId.toString() && req.user.roles.indexOf('Admin') === -1) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        const orders = await OrderSchema.find({type: 'inplace', customer: customerId}).lean().exec();

        res.status(200).json({message: 'Success', orders});
    } catch (err) {
        next(err);
    }
}



const updateInplaceOrder = async (req, res, next) => {
    const orderId = req.params.id;

    const {customer, description, price, status} = req.body;

    if(!customer || !description || price <= 0 || !status) {
        return res.status(422).json({message: 'Invalid Input'});
    }

    try {
        const order = await OrderSchema.findById(orderId).lean().exec();

        if(!order) return res.status(404).json({message: 'Inplace order not found'});

        if(order.inplaceOrder?.handledBy.toString() !== req.user.id.toString() && req.user.roles.indexOf('Admin') === -1) {
            
            return res.status(401).json({message: 'Unauthorized'});
        }

        const newOrder = {
            customer,
            'inplaceOrder.description': description,
            'inplaceOrder.price': price,
            'inplaceOrder.status': status,
        }

        await OrderSchema.findOneAndUpdate({_id: orderId}, newOrder);
        res.status(200).json({message: 'Inplace order updated successfully'});
    } catch (err) {
        next(err);
    }
}




const getInplaceOrder = async (req, res, next) => {
    const orderId = req.params.id;

    try {
        const order = await OrderSchema.findById(orderId).lean().exec();

        if(!order) {
            return res.status(404).json({message: 'Inplace order not found'});
        }

        if(order.inplaceOrder?.handledBy.toString() !== req.user.id && req.user.roles.indexOf('Admin') === -1) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        res.status(200).json({message: 'Success', order});
    } catch (err) {
        next(err);
    }
}



const deleteInplaceOrder = async (req, res, next) => {
    const id = req.params.id;

    try {
        const order = await OrderSchema.findById(id).exec();

        if(!order) return res.status(404).json({message: 'Order not found'});

        if(order.inplaceOrder?.handledBy.toString() !== req.user.id.toString() && req.user.roles.indexOf('Admin') === -1) {
            
            return res.status(401).json({message: 'Unauthorized'});
        }

        await order.remove();

        res.status(200).json({message: 'Inplace order removed'});

    } catch (err) {
        next(err);
    }
}



const getAllEmployeeSalesOrders = async (req, res, next) => {
    const employeeId = req.params.id;

    if(req.user.id.toString() !== employeeId && req.user.roles.indexOf('Admin') === -1) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        const orders = await OrderSchema.find({$or: [{type: 'inplace', 'inplaceOrder.handledBy': employeeId}, {type: 'online-service', 'onlineServiceOrder.handledBy': employeeId}]})
                                .populate('customer', '_id userId username')
                                .lean()
                                .exec();

        res.status(200).json({message: 'success', orders});
    } catch (err) {
        next(err);
    }
}




const createNewOnlineServiceOrder = async (req, res, next) => {
    const {problem, contact, currentLocation} = req.body;

    if(!problem || !contact || !currentLocation) {
        return res.status(422).json({message: 'Invalid Inputs'});
    }

    const coordinates = [currentLocation.long, currentLocation.lat];
    
    const newServiceOrder = {
        type: 'online-service',
        customer: req.user.id,
        onlineServiceOrder: {
            problem,
            contactNo: contact,
            status: 'pending',
            isUndertaken: false,
            location: {
                type: "Point",
                coordinates
            }
            
        }

    }

    try {
        await OrderSchema.create(newServiceOrder);
        res.status(201).json({message: 'Service order created'});
    } catch (err) {
        console.log(err.message);
        next(err);
    }
}



const getAllCustomerServiceOrders = async (req, res, next) => {
    const customerId = req.params.id;

    if(req.user.id.toString() !== customerId && req.user.roles.indexOf('Admin') === -1) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        const orders = await OrderSchema.find({type: 'online-service', customer: customerId}).lean().exec();

        res.status(200).json({message: 'Success', orders});
    } catch (err) {
        next(err);
    }
}



const getSingleServiceOrder = async (req, res, next) => {
    const orderId = req.params.id;

    try {
        const order = await OrderSchema.findById(orderId).lean().exec();

        if(!order) return res.status(404).json({message: 'service order not found'});

        if(order.customer.toString() !== req.user.id.toString() && req.user.roles.indexOf('Admin') === -1) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        res.status(200).json({message: 'success', order});
    } catch (err) {
        next(err);
    }
}



const updateServiceOrder = async (req, res, next) => {
    const orderId = req.params.id;

    const {problem, contact, currentLocation} = req.body;

    if(!problem || !contact || !currentLocation) {
        return res.status(422).json({message: 'Invalid Inputs'});
    }

    try {
        const order = await OrderSchema.findById(orderId).exec();

        if(!order) return res.status(404).json({message: 'service order not found'});

        if(order.customer.toString() !== req.user.id.toString() && req.user.roles.indexOf('Admin') === -1) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        const coordinates = [currentLocation.long, currentLocation.lat];

        order.onlineServiceOrder.problem = problem;
        order.onlineServiceOrder.contactNo = contact;
        order.onlineServiceOrder.location.coordinates = coordinates;

        await order.save();
        res.status(200).json({message: 'service order updated'});

    } catch (err) {
        next(err);
    }
}



const getAllAvailableServiceOrders = async (req, res, next) => {

    try {
        const orders = await OrderSchema.find({type: 'online-service', 'onlineServiceOrder.isUndertaken': false}).lean().exec();

        res.status(200).json({message: 'success', orders});
    } catch (err) {
        next(err);
    }
}


const updateServiceOrderAcceptStatus = async (req, res, next) => {
    const orderId = req.body.id;

    try {
        const order = await OrderSchema.findById(orderId).exec();

        if(!order) return res.status(404).json({message: 'Service order not found'});

        if(order.onlineServiceOrder?.isUndertaken) {
            return res.status(422).json({message: 'This service order is already handled by an employee'});
        }

        order.onlineServiceOrder.isUndertaken = true;
        order.onlineServiceOrder.handledBy = req.user.id;
        order.onlineServiceOrder.status = 'accepted';

        await order.save();
        res.status(200).json({message: 'service order updated'});
    } catch (err) {
        next(err);
    }
}



const updateServiceOrderPriceAndCompletion = async (req, res, next) => {
    const orderId = req.params.id;

    try {
        const order = await OrderSchema.findById(orderId).exec();

        if(!order) return res.status(404).json({message: 'Service order not found'});

        if(order.onlineServiceOrder?.handledBy.toString() !== req.user.id && req.user.roles.indexOf('Admin') === -1) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        if(req.query.type === 'price') {
            const price = +req.body.price;

            if(!price || typeof price !== 'number' || price <= 0) {
                return res.status(422).json({message: 'Invalid Input'});
            }

            order.onlineServiceOrder.price = price;
            await order.save();
            res.status(200).json({message: 'service order price updated'});
        }

        if(req.query.type === 'completion') {
            if(!order.onlineServiceOrder?.price || order.onlineServiceOrder?.prcie <= 0) {
                return res.status(422).json({message: 'Price not set yet'});
            }

            order.onlineServiceOrder.status = 'completed';
            await order.save();
            res.status(200).json({message: 'Order status updated to complete'});
        }

        if(req.query.type === 'accepted') {
            order.onlineServiceOrder.status = 'accepted';
            await order.save();
            res.status(200).json({message: 'Order status updated to accepted'});
        }
    } catch (err) {
        next(err);
    }
}




const getAllPurchaseOrders = async (req, res , next) => {

    try {
        const orders = await OrderSchema.find({type: 'online-purchase'}).lean().exec();
        res.status(200).json({message: 'Success', orders});
    } catch (err) {
        next(err);
    }
}



const createNewOnlinePurchaseOrder = async (req, res, next) => {
    const {deliveryLocation, deliveryAddress, orderItems, orderTotal} = req.body;

    
    if(!deliveryLocation || !deliveryAddress || !Array.isArray(orderItems) || !orderTotal || typeof orderTotal !== 'number') {
        return res.status(422).json({message: 'Invalid Inputs'});
    }

    const structuredOrderItems = orderItems.map(item => {
        return {
            product: {
                id: item._id,
                productId: item.productData.productId,
                title: item.productData.title,
                condition: item.productData.condition,
                image: item.productData.image
            },
            qty: +item.qty,
            color: item.color,
            unitPrice: item.productData.price,
            totalPrice: +item.qty * +item.productData.price,
        }
    })

    const newPurchaseOrder = {
        type: 'online-purchase',
        customer: req.user.id,
        onlinePurchaseOrder: {
            orderItems: structuredOrderItems,
            deliveryLocation: {
                type: 'Point',
                coordinates: [deliveryLocation.long, deliveryLocation.lat]
            },
            deliveryAddress: {
                address: deliveryAddress.address,
                city: deliveryAddress.city,
                postalCode: deliveryAddress.zip
            },
            status: 'pending',
            totalPrice: +orderTotal.toFixed(2)
        }
    }

    try {
        
        const order = await OrderSchema.create(newPurchaseOrder);

        
        const newOrderItems = order.onlinePurchaseOrder.orderItems;

        for(let item of newOrderItems) {
            const product = await ProductSchema.findById(item.product.id);
            const newQty = product.colorVariation[item.color] - item.qty;
            
            product.colorVariation = {
                ...product.colorVariation,
                [item.color]: newQty
            }

            product.soldInfo = {
                ...product.soldInfo,
                [item.color]: product.soldInfo?.[item.color] ? product.soldInfo[item.color] + item.qty : item.qty
            }

            await product.save();
        }

        res.status(201).json({message: 'Purchase order created', order});

    } catch (err) {
        console.log(err);
        next(err);
    }

}




const getSinglePurchaseOrder = async (req, res, next) => {
    const id = req.params.id;

    try {
        const order = await OrderSchema.findById(id).populate('customer', '-password').lean().exec();

        if(req.user.id.toString() !== order.customer._id.toString() && req.user.roles.indexOf('Admin') === -1 && req.user.roles.indexOf('Employee') === -1) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        res.status(200).json({message: 'success', order});
    } catch (err) {
        next(err);
    }
}




const getLoggedInUserPurchaseOrders = async (req, res, next) => {

    try {
        const orders = await OrderSchema.find({type: 'online-purchase', customer: req.user.id}).lean().exec();

        res.status(200).json({message: 'success', orders});
    } catch (err) {
        next(err);
    }
}



const updatePurchaseOrderPaidStatus = async (req, res, next) => {

    try {
    
        const order = await OrderSchema.findById(req.params.id).exec();

        if(!order) return res.status(404).json({message: 'Order not found'});

        const updatedOrder = await OrderSchema.findOneAndUpdate(
            {_id: req.params.id}, 
            {'onlinePurchaseOrder.isPaid': true, 'onlinePurchaseOrder.paidAt': new Date(), 'onlinePurchaseOrder.paymentResults': req.body.paymentResults},
            {new: true}
        )

        res.status(200).json({message: 'Payment Success', order: updatedOrder});
        } catch(err) {
            next(err);
        }

}


const updatePurchaseOrderStatus = async (req, res, next) => {

    try {
        const order = await OrderSchema.findById(req.params.id).exec();

        if(!order) return res.status(404).json({message: 'Order not found'});

        const updatedOrder = await OrderSchema.findOneAndUpdate(
            {_id: req.params.id}, 
            {'onlinePurchaseOrder.status': req.body.status},
            {new: true}
        )

        res.status(200).json({message: 'Payment Success', order: updatedOrder});
    } catch(err) {
            next(err);
    }

}



module.exports = {
    createNewInplaceOrder,
    getAllEmployeeInplaceOrders,
    getAllCustomerInplaceOrders,
    updateInplaceOrder,
    deleteInplaceOrder,
    getInplaceOrder,
    getAllEmployeeSalesOrders,

    createNewOnlineServiceOrder,
    getAllCustomerServiceOrders,
    getSingleServiceOrder,
    updateServiceOrder,
    getAllAvailableServiceOrders,
    updateServiceOrderAcceptStatus,
    updateServiceOrderPriceAndCompletion,

    getAllPurchaseOrders,
    createNewOnlinePurchaseOrder,
    getSinglePurchaseOrder,
    getLoggedInUserPurchaseOrders,
    updatePurchaseOrderPaidStatus,
    updatePurchaseOrderStatus
}