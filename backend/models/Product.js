const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    condition: {
        type: String,
        enum: ['new', 'used'],
        default: 'new'
    },
    state: {
        type: String,
        enum: ['warehouse', 'showroom'],
        require: true
    },
    colorVariation: {
        type: Object,
        required: true
    },
    images: [
        {
            fileName: {
                type: String,
                require: true
            },
            url: {
                type: String,
                require: true
            }
        }
    ],
    soldInfo: {
        type: Object
    }

}, {
    timestamps: true
});

ProductSchema.plugin(AutoIncrement, {
    inc_field: 'productId',
    id: 'productIds',
    start_seq: 20000
})

module.exports = mongoose.model('Product', ProductSchema);

