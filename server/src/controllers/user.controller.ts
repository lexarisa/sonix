// imports
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { CustomRequest } from '../types/user.types';
import { LikedObjectType } from '../types/user.types';

// import models
import User from '../models/user.model';

// import the token secret
const SECRET = process.env.SECRET || '';

//! user controller methods
const createUser = async (req: Request, res: Response) => {
  // get the info from the request body
  const { firstName, lastName, password, email, handle, bio } = req.body;

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

const loginUser = async (req: Request, res: Response) => {
  // get the email and password
  const { email, password } = req.body;

  try {
    //get the user from db
    const user = await User.findOne({ email });

    //check user exists
    if (!user) throw new Error('Invalid credentials');
    //compare passwords
    const authorized = await bcrypt.compare(password, user.password);

    if (!authorized) throw new Error('Invalid credentials');
    // create a new token

    const token = jwt.sign({ _id: user._id }, SECRET);
    //send the user the token

    res.status(200).send({ token });
  } catch (error) {
    res.status(401).send({ error, message: 'Invalid credentials!' });
  }
};

// get user profile of logged in user
const getMyProfile = async (req: Request, res: Response) => {
  const { _id } = res.locals.user;

  try {
    const profile = await User.findById({ _id })
      .lean()
      .select('_id handle bio ownRecipes likedRecipes joined');

    if (profile) {
      const likedObject: LikedObjectType = {};
      profile.likedRecipes.forEach((id: string) => {
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

const getUserProfile = async (req: Request, res: Response) => {
  // get the user profile id
  const { userHandle } = req.params;

  try {
    // check the user exists
    //todo - refactor this line to use .select() to only get required bits
    const { _id, handle, bio, ownRecipes, likedRecipes } = await User.findOne({
      handle: userHandle,
    });
    if (!_id) throw new Error('User profile not found');

    // create the user profile
    const profile = { _id, handle, bio, ownRecipes, likedRecipes };
    // return the user profile
    res.status(200).send(profile);
  } catch (error) {
    res.status(404).send({ error, message: 'Profile not found' });
  }
};

// todo - do this later if time
const editUserProfile = async (req: Request, res: Response) => {
  //get user id and body
  const { _id } = res.locals.user;
  const { bio } = req.body;

  // find one and update
  try {
    const result = await User.findOneAndUpdate(
      { _id: _id },
      { bio: bio },
      { new: true }
    );

    return res.status(200).send(result);
  } catch (error) {
    // console.error('my error', error);
    return res.status(400).send({ error, message: 'Profile not found' });
  }
};

export { createUser, loginUser, getUserProfile, editUserProfile, getMyProfile };
