const UserSchema = require('../models/User');

const updateProfile = async (req, res, next) => {
    const id = req.user.id;

    const {firstName, lastName, email, address, phone, age} = req.body;

    if(!firstName || !lastName || !address || !email || !phone) {
        return res.status(422).json({message: 'Invalid Inputs'});
    }

    if(req.user.roles.indexOf('Employee') >= 0 && (!age || +age <= 0)) {
        return res.status(422).json({message: 'Invalid Inputs'});
    } 

    try {

        const user = await UserSchema.findById(id).exec();

        if(!user) return res.status(404).json({message: 'User not found'});

        const updateData = {
            firstName,
            lastName,
            address,
            email,
            phone
        }

        let updatedUser;

        if(req.user.roles.indexOf('Employee') === -1) {
            
            updatedUser = await UserSchema.findOneAndUpdate({_id: id}, {customer: updateData}, {new: true}).lean().exec();
        } else {
            
            updateData.age = age;
            updatedUser = await UserSchema.findOneAndUpdate({_id: id}, {employee: updateData}, {new: true}).lean().exec();
        }

        res.status(200).json({message: 'Profile updated', profile: updatedUser});

    } catch(err) {
        next(err);
    }
}


const getProfile = async (req, res, next) => {

    const id = req.user.id;

    try {
        const user = await UserSchema.findById(id).select('-username -password').lean().exec();
        res.status(200).json({message: 'Success', profile: user});
    } catch (err) {
        next(err);
    }
}


module.exports = {
    updateProfile,
    getProfile
}