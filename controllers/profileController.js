const _ = require('lodash');
const { Profile } = require('../models/profile');


module.exports.getProfile = async (req, res) => {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId });
    res.status(200).send(profile);
};

module.exports.setProfile = async (req, res) => {
    //create or update profile
    const userId = req.user._id;
    const userProfile = _.pick(req.body, ['phone', 'address1', 'address2', 'city', 'state', 'postcode', 'country'])
    userProfile.user = userId;
    let profile = await Profile.findOne({ user: userId });
    if (profile) {
        //update
        profile = await Profile.updateOne({ user: userId }, userProfile, { new: true });
        return res.status(200).send(profile);
    } else {
        //create
        profile = new Profile(userProfile);
        profile = await profile.save();
        return res.status(200).send(profile);
    }
    // return res.status(200).send("Profile created/Updated successfully");

};