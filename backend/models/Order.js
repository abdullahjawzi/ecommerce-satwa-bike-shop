const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    type: {
        type: String,
        enum: ['online-purchase', 'online-service', 'inplace'],
        require: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    inplaceOrder: {
        description: String,
        price: Number,
        handledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'completed']
        }
    },
    onlinePurchaseOrder: {
        orderItems: [
            {
                product: {
                    id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Product'
                    },
                    productId: String,
                    title: String,
                    condition: String,
                    image: {
                        fileName: String,
                        url: String
                    }
                },
                qty: Number,
                color: String,
                unitPrice: Number,
                totalPrice: Number,
            }
        ],
        deliveryLocation: {
            type:  {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                index: { type: '2dsphere', sparse: false }
            }
        },
        deliveryAddress: {
            address: {type: String},
            city: {type: String},
            postalCode: {type: String}
        },
        status: {
            type: String,
            enum: ['pending', 'delivered', 'completed']
        },
        totalPrice: {
            type: Number,
            default: 0.0
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        paymentResults: {
            id: {type: String, default: ''},
            status: {type: String, default: ''},
            update_time: {type: String, default: ''},
            email_address: {type: String, default: ''}
        },
        paidAt: {
            type: Date
        },
        deliverdAt: {
            type: Date
        }
    },
    onlineServiceOrder: {
        problem: String,
        location: {
            type: {
              type: String, 
              enum: ['Point'] 
            },
            coordinates: {
              type: [Number],
              index: { type: '2dsphere', sparse: false }
            }
        },
        contactNo: String,
        isUndertaken: {
            type: Boolean,
            default: false
        },
        handledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        price: Number,
        status: {
            type: String,
            enum: ['pending', 'accepted', 'completed'],
            default: 'pending'
        }
    }
}, {
    timestamps: true
});


OrderSchema.plugin(AutoIncrement, {
    inc_field: 'orderId',
    id: 'orderIds',
    start_seq: 100
})

module.exports = mongoose.model('Order', OrderSchema);
