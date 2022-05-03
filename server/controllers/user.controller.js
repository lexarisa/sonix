// imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// import models
const User = require('../models/user.model');

// import the token secret
const SECRET = process.env.SECRET;

//! user controller methods
const createUser = async (req, res) => {
  // get the info from the request body
  const { firstName, lastName, password, email, handle, bio } = req.body;
  console.log('REQ BODY', req.body);
  try {
    // check the password is not empty
    if (password === '') throw new Error('password is empty');
    // hash the password
    const hash = await bcrypt.hash(password, 10);
    // create the new user
    const { _id } = await User.create({
      firstName,
      lastName,
      password: hash,
      email,
      handle,
      bio,
    });
    // create a new token and send to the user
    const token = jwt.sign({ _id }, SECRET);
    res.status(201).send({ token });
  } catch (error) {
    res.status(400).send({ error, message: 'Could not create the user' });
  }
};

const loginUser = async (req, res) => {
  // get the email and password
  const { email, password } = req.body;
  console.log('req', req.body);
  try {
    //get the user from db
    const user = await User.findOne({ email });

    console.log('user', user);
    //check user exists
    if (!user) throw new Error('Invalid credentials');
    //compare passwords
    const authorized = await bcrypt.compare(password, user.password);

    console.log('authorized', authorized);
    if (!authorized) throw new Error('Invalid credentials');
    // create a new token

    const token = jwt.sign({ _id: user._id }, SECRET);
    //send the user the token

    res.status(200).send({ token });
  } catch (error) {
    console.log('loggggg', error);
    res.status(401).send({ error, message: 'Invalid credentials!' });
  }
};

// get user profile of logged in user
const getMyProfile = async (req, res) => {
  const { _id } = req.user;

  try {
    const profile = await User.findById({ _id })
      .lean()
      .select('_id handle bio ownRecipes likedRecipes joined');

    if (profile) {
      const likedObject = {};
      profile.likedRecipes.forEach((id) => {
        likedObject[id] = true;
      });
      profile.likedRecipes = likedObject;
      return res.status(200).json(profile);
    } else {
      return res.status(404).send({ message: 'No profile attached to user!' });
    }
  } catch (error) {
    res.status(404).send({ error, message: 'Profile not found' });
  }
};

const getUserProfile = async (req, res) => {
  // get the user profile id
  const { userHandle } = req.params;

  try {
    // check the user exists
    //todo - refactor this line to use .select() to only get required bits
    const { _id, handle, bio, ownRecipes, likedRecipes } = await User.findOne({
      handle: userHandle,
    });
    if (!_id) throw new Error('User profile not found');
    console.log('user: ', handle, _id);

    // create the user profile
    const profile = { _id, handle, bio, ownRecipes, likedRecipes };
    // return the user profile
    res.status(200).send(profile);
  } catch (error) {
    res.status(404).send({ error, message: 'Profile not found' });
  }
};

// todo - do this later if time
const editUserProfile = async (req, res) => {
  //get ueer id and body
  const { _id } = req.user;
  const { bio } = req.body;
  // console.log('updating: ', _id, bio);
  // find one and update
  try {
    const result = await User.findOneAndUpdate(
      { _id: _id },
      { bio: bio },
      { new: true }
    );
    console.log(result);
    return res.status(200).send(result);
  } catch (error) {
    // console.error('my error', error);
    return res.status(400).send({ error, message: 'Profile not found' });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserProfile,
  editUserProfile,
  getMyProfile,
};
