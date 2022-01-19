const { Schema, model } = require('mongoose');
const { CartItemSchema } = require('./cartItem')

module.exports.order = model('order', Schema({
    cartItems: [CartItemSchema],
    tarnsaction_Id: {
        type: String,
        unique: true,
    },
    address: {
        phone: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        postcode: Number,
        country: String,
    },
    status: {  //payment status
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'pending'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    sessionkey: String,
}))