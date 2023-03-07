const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


SupplierSchema.plugin(AutoIncrement, {
    inc_field: 'supplierId',
    id: 'supplierIds',
    start_seq: 10000
})

module.exports = mongoose.model('Supplier', SupplierSchema);
