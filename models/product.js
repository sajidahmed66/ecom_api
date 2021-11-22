const { Schema, model } = require('mongoose');
const joi = require('joi');

module.exports.Product = model('Product', Schema({
    name: String,
    description: String,
    price: Number,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    quantity: Number,
    photo: {
        data: Buffer,
        contentType: String
    },

}, { timestamps: true }));

module.exports.validate = (product) => {
    const schema = {
        name: joi.string().min(3).max(50).required(),
        description: joi.string().min(3).max(255).required(),
        price: joi.number().min(1).required(),
        category: joi.string().min(3).max(50).required(),
        quantity: joi.number().min(1).required(),
    }
    return joi.validate(product, schema);
}