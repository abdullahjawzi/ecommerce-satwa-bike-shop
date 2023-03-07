const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, cb) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin) {
            
            cb(null, true);
        } else {
            cb(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions;