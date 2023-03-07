const UserSchema = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res, next) => {
    
    const {username, password} = req.body;

    if(!username || !password) {
        return res.status(400).json({message: 'Invalid username or password'});
    }

    try {
        const userExist = await UserSchema.findOne({username}).exec();

        if(!userExist) {
            return res.status(404).json({message: 'Invalid username or password'});
        }

        
        const isMatch = await bcrypt.compare(password, userExist.password);

        if(!isMatch) {
            return res.status(404).json({message: 'Invalid username or password'});
        }

        
        const accessToken = jwt.sign({id: userExist._id, roles: userExist.roles}, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: '1d'});

        const refreshToken = jwt.sign({id: userExist._id, roles: userExist.roles}, process.env.JWT_REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

        
        res.cookie('jwt',
            refreshToken, 
            {httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000}
        )

        
        userExist.refreshToken = refreshToken;
        await userExist.save();

        
        const user = {
            roles: userExist.roles,
            id: userExist._id,
            username: userExist.username,
            data: userExist.roles.includes('Employee') ? userExist.employee : userExist.customer
        }

        res.status(200).json({message: 'Login success', accessToken, user});
    } catch (err) {
        next(err);
    }
}

const refresh = async (req, res, next) => {
    const cookie = req.cookies;

    if(!cookie?.jwt) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    const refreshToken = cookie.jwt;


        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decode) => {
            if(err) return res.status(403).json({message: 'Forbidden'});

            UserSchema.findById(decode.id)
                .then(user => {
                    if(!user) return res.status(403).json({message: 'Forbidden'});

                    if(user?.refreshToken !== refreshToken) {
                        return res.status(403).json({message: 'Forbidden'});
                    }

                    const accessToken = jwt.sign({id: user._id, roles: user.roles}, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: '1d'});

                    const userExists = {
                        roles: user.roles,
                        id: user._id,
                        username: user.username,
                        data: user.roles.includes('Employee') ? user.employee : user.customer
                    }

                    res.status(200).json({message: 'Access token created', accessToken, user: userExists});
                })
                .catch(err => next(err))

        })

}



const logout = async (req, res, next) => {

    try {

        if(req.body.id) {
            await UserSchema.findOneAndUpdate({_id: req.body.id}, {refreshToken: null});
        }
        const cookie = req.cookies;

        if(!cookie?.jwt) return res.status(204).json({message: 'Success'}); 

        
        res.clearCookie('jwt', {httpOnly: true, secure: true, sameSite: 'None'});

        res.status(200).json({message: 'Logout Success'});
        
    } catch (err) {
        next(err);
    }

}

module.exports = {
    login,
    refresh,
    logout
}