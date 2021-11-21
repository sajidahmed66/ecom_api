const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

//routres imports
const userRouter = require('./routers/userRouter');


//middleware 
app.use(cors());
app.use(express.json()); //for parsing application/json
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//routes defined and used
app.use('/api/user', userRouter);

module.exports = app;