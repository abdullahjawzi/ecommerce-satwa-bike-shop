require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    
    const authHeader = req.headers['Authorization'] || req.headers['authorization'] || null;

    if(!authHeader) return res.status(401).json({message: 'Unauthorized'});

    const token = authHeader.split(' ')[1] || null;

    if(!token) return res.status(401).json({message: 'Unauthorized'});

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decode) => {
        if(err) return res.status(403).json({message: 'Forbidden'});

        req.user = decode;
        next();
    })
}

const isAdmin = (req, res, next) => {
    
    if(req.user?.roles.indexOf('Admin') !== -1) {
        next();
    } else {
        return res.status(401).json({message: 'Unauthorized'});
    }
}

const isEmployee = (req, res, next) => {
    
    if(req.user?.roles.indexOf('Employee') !== -1) {
        next();
    } else {
        return res.status(401).json({message: 'Unauthorized'});
    }
}

module.exports = {
    auth,
    isAdmin,
    isEmployee
}