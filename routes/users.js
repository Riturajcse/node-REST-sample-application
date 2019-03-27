const {User, validate} = require('../models/user');
const _ = require('lodash');
const auth = require('../middleware/auth');
const bCrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.find().sort('name');
  res.send(users);
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findOne({_id: req.user._id});
    res.send(user);
  });

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if (user) return res.status(400).send('User already exists');

  user = new User({ name: req.body.name, email: req.body.email, password: req.body.password });
  const salt = await bCrypt.genSalt(10);
  const userPassword = await bCrypt.hash(user.password, salt);
  user.password = userPassword;
  user = await user.save();
  
  res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;