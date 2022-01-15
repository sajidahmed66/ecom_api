const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

module.exports = (app) => {
    app.use(cors());
    app.use(express.json()); //for parsing application/json
    app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

}