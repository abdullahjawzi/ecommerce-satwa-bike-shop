const {logEvents} = require('./logger');


const error = (err, req, res, next) => {
    logEvents(`${err.name}\t${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errorLog.log');

    const status = res.statusCode === 200 ? 500 : res.statusCode ? res.statusCode : 500;

    res.status(status).json({message: err.message});
}

module.exports = error;

