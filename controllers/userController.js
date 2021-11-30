const { User, validate } = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('lodash');

//sign up controller
module.exports.signUp = async (req, res) => {
    // joi validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user already exists
    let user = {};
    user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('Vai apnake Chena chena lagtese');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    //hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    //genarate auth token
    const token = user.generateAuthToken();

    //save user
    const result = await user.save();
    return res.status(201).send({ user: _.pick(result, ['_id', 'name', 'email']), token: token });


};

//login/signIn controller
module.exports.signIn = async (req, res) => {
    /*
    as fornt end will validate the user and send the user object
    so there is no need to validate again;
    
     const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    */
    let user = {};
    user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid Email or password');

    //password validation
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid Email or password');

    //genarate auth token
    const token = user.generateAuthToken();

    return res.status(200).send({ user: _.pick(user, ['_id', 'name', 'email']), token: token });

};

