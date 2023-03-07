const SupplierSchema = require('../models/Supplier');
const ProductSchema = require('../models/Product');



const createNewSupplier = async (req, res, next) => {

    const {name, email, phone} = req.body;

    if(!name.trim() || !email.trim() || !phone.trim()) {
        return res.status(422).json({message: 'Invalid Input'});
    }

    try {
        const supplier = await SupplierSchema.create(req.body);
        res.status(201).json({message: 'New Supplier Created', supplier});
    } catch (err) {
        next(err);
    }
}



const getAllSuppliers = async (req, res, next) => {

    try {
        const suppliers = await SupplierSchema.find({isActive: true}).lean().exec();
        res.status(201).json({message: 'New Supplier Created', suppliers});
    } catch (err) {
        next(err);
    }
}



const getSupplier = async (req, res, next) => {
    const id = req.params.id;
    try {
        const supplier = await SupplierSchema.findById(id).lean();
        res.status(201).json({message: 'New Supplier Created', supplier});
    } catch (err) {
        next(err);
    }
}


const updateSupplier = async (req, res, next) => {
    const id = req.params.id;

    const {name, email, phone} = req.body;

    if(!name.trim() || !email.trim() || !phone.trim()) {
        return res.status(422).json({message: 'Invalid Input'});
    }

    try {
        const supplier = await SupplierSchema.findById(id);

        if(!supplier) {
            return res.status(404).json('No Supplier Found');
        }

        supplier.name = name;
        supplier.email = email;
        supplier.phone = phone;

        await supplier.save();

        res.status(201).json({message: 'Supplier Updated'});
    } catch (err) {
        next(err);
    }
}



const removeSupplier = async (req, res, next) => {
    const id = req.params.id;
    try {
        const supplier = await SupplierSchema.findById(id);

        if(!supplier) {
            return res.status(404).json('No Supplier Found');
        }

        const isSupplied = await ProductSchema.findOne({supplier: id});

        if(isSupplied) {
            supplier.isActive = false;
            await supplier.save();
        } else {
            await supplier.remove();
        }

        res.status(201).json({message: 'Supplier Deleted'});
    } catch (err) {
        next(err);
    }
}



module.exports = {
    createNewSupplier,
    getAllSuppliers,
    getSupplier,
    updateSupplier,
    removeSupplier
}