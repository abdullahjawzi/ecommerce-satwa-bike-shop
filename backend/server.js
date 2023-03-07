const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const {logger, logEvents} = require('./middleware/logger');
const error = require('./middleware/error');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/db');
const app = express();

// establish the mongoDB connection
connectDB();

// log every request middleware
app.use(logger);

// CORS middleware
app.use(cors(corsOptions));

// cookie parser middleware
app.use(cookieParser());

// JSON body parser middleware
app.use(express.json());


// api routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));



// error handling middleware
app.use(error);


const PORT = process.env.PORT || 8080;

// listen for mongoDB connection success
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB database');
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
});

// listen for any mongoDB connection error
mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}:${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErr.log');
})
