const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [
        {
            type: String,
            default: "Employee",
            enum: ['Customer', 'Employee', 'Admin']
        }
    ],
    employee: {
        firstName: String,
        lastName: String,
        address: String,
        age: Number,
        email: String,
        salary: Number,
        phone: String
    },
    customer: {
        firstName: String,
        lastName: String,
        address: String,
        email:String,
        phone: String
    },
    refreshToken: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

UserSchema.plugin(AutoIncrement, {
    inc_field: 'userId',
    id: 'userIds',
    start_seq: 100
})

module.exports = mongoose.model('User', UserSchema);