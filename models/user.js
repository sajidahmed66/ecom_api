const { Schema, model } = require('mongoose');
const joi = require('joi');
const jwt = require('jsonwebtoken');


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        role: this.role,
        name: this.name,
        email: this.email
    }, process.env.JWT_SECRET_KEY, { expiresIn: '12h' });
    return token;
}

const validateUser = (user) => {
    const schema = joi.object({
        name: joi.string().min(3).max(100).required(),
        email: joi.string().min(5).max(255).required().email(),
        password: joi.string().min(5).max(100).required()
    });
    return schema.validate(user, userSchema);
};

module.exports.User = model('User', userSchema);
module.exports.validate = validateUser;