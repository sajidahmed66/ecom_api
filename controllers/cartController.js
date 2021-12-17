const _ = require('lodash');
const { CartItem, CartItemSchema } = require('../models/cartItem');

module.exports.createCartItem = async (req, res) => {
    let { product, price } = _.pick(req.body, ['product', 'price']);
    // check if product is already in cart
    let cartItem = await CartItem.findOne({
        user: req.user._id,
        product: product
    })
    if (cartItem) return res.status(400).send('Product already in cart');
    // create new cart item
    cartItem = new CartItem({
        user: req.user._id,
        product: product,
        price: price
    });
    let result = await cartItem.save();
    res.status(200).send(
        {
            message: 'Cart item created successfully',
            cartItem: result
        }
    );
};

module.exports.getCartItem = async (req, res) => {
    const cartItem = await CartItem.find({ user: req.user._id })
        .populate('product', 'name')
        .populate('user', 'name');
    res.status(200).send(cartItem);
};

module.exports.updateCartItem = async (req, res) => {
    let { _id, quantity } = _.pick(req.body, ['_id', 'quantity']);
    let cartItem = await CartItem.updateOne({
        _id: _id,
        user: req.user._id
    }, { quantity: quantity }, { new: true });
    res.status(200).send(cartItem);
};

module.exports.deleteCartItem = async (req, res) => {
    const _id = req.params.id;
    const user_id = req.user._id;
    await CartItem.deleteOne({
        _id: _id,
        user: user_id
    });
    res.status(200).send({ 'message': 'Cart item deleted successfully' });
};
