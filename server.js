//file that initializes the server
// this is the entrypoint for the server
require('dotenv').config(); //load environment variables from .env file
const mongoose = require('mongoose');
const app = require('./app');
//connect to mongodb via mongoose
mongoose.connect(process.env.MONGODB_URL_LOCAL)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB...', err));

//connect to server 
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});