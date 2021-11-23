require('express-async-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const { error } = require('./middlewares/error')
//routres imports
const userRouter = require('./routers/userRouter');
const categoryRouter = require('./routers/categoryRouter');
const productRouter = require('./routers/productRouter');
//middleware 
app.use(cors());
app.use(express.json()); //for parsing application/json
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//routes defined and used
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);

// global error handler
app.use(error);

module.exports = app;