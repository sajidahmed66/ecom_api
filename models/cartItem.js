const { Schema, model } = require('mongoose');

const CartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    price: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports.CartItemSchema = CartItemSchema; // will be useful with order model Maybe!!
module.exports.CartItem = model('CartItem', CartItemSchema);