//category schema 
const { Schema, model } = require('mongoose');
const joi = require('joi');

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

}, { timestamps: true });

module.exports.Category = model('Category', categorySchema);

module.exports.validate = (category) => {
    const schema = joi.object({
        name: joi.string().required().min(3).max(50),
    });
    return schema.validate(category);
};
