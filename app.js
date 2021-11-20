const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');



//middleware 
app.use(cors());
app.use(express.json()); //for parsing application/json
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


module.exports = app;