require('express-async-errors');
const express = require('express');
const app = express();
const { error } = require('./middlewares/error')

//middleware 
require('./middlewares')(app); // import the middlewares from the index and pass the app as a parameter ; this type of middleware is like app.use()
//routes imports
require('./middlewares/routes')(app);
// global error handler (must be called after the routes)
app.use(error);

module.exports = app;