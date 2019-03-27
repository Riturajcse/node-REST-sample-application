const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const config = require('config');
const genres = require('./routes/genres');
const users = require('./routes/users');
const auth = require('./routes/auth');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

if(!config.get('jwtPrivateKey')) {
  console.log('FATAL Error:- jwtPrivateKey is not available');
  process.exit();
}

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));