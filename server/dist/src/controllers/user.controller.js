"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProfile = exports.editUserProfile = exports.getUserProfile = exports.loginUser = exports.createUser = void 0;
// imports
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import models
const user_model_1 = __importDefault(require("../models/user.model"));
// import the token secret
const SECRET = process.env.SECRET || '';
//! user controller methods
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the info from the request body
    const { firstName, lastName, password, email, handle, bio } = req.body;
    try {
        // check the password is not empty
        if (password === '')
            throw new Error('password is empty');
        // hash the password
        const hash = yield bcrypt_1.default.hash(password, 10);
        // create the new user
        const { _id } = yield user_model_1.default.create({
            firstName,
            lastName,
            password: hash,
            email,
            handle,
            bio,
        });
        // create a new token and send to the user
        const token = jsonwebtoken_1.default.sign({ _id }, SECRET);
        return res.status(201).send({ token });
    }
    catch (error) {
        res.status(400).send({ error, message: 'Could not create the user' });
        console.log(error);
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('running');
    // get the email and password
    const { email, password } = req.body;
    try {
        //get the user from db
        const user = yield user_model_1.default.findOne({ email });
        //check user exists
        if (!user)
            throw new Error('Invalid credentials');
        //compare passwords
        const authorized = yield bcrypt_1.default.compare(password, user.password);
        if (!authorized)
            throw new Error('Invalid credentials');
        // create a new token
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, SECRET);
        //send the user the token
        res.status(200).send({ token });
    }
    catch (error) {
        res.status(401).send({ error, message: 'Invalid credentials!' });
    }
});
exports.loginUser = loginUser;
// get user profile of logged in user
const getMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = res.locals.user;
    try {
        const profile = yield user_model_1.default.findById({ _id })
            .lean()
            .select('_id handle bio ownRecipes likedRecipes joined');
        if (profile) {
            const likedObject = {};
            profile.likedRecipes.forEach((id) => {
                likedObject[id] = true;
            });
            profile.likedRecipes = likedObject;
            return res.status(200).json(profile);
        }
        else {
            return res.status(404).send({ message: 'No profile attached to user!' });
        }
    }
    catch (error) {
        res.status(404).send({ error, message: 'Profile not found' });
    }
});
exports.getMyProfile = getMyProfile;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the user profile id
    const { userHandle } = req.params;
    try {
        // check the user exists
        //todo - refactor this line to use .select() to only get required bits
        const { _id, handle, bio, ownRecipes, likedRecipes } = yield user_model_1.default.findOne({
            handle: userHandle,
        });
        if (!_id)
            throw new Error('User profile not found');
        // create the user profile
        const profile = { _id, handle, bio, ownRecipes, likedRecipes };
        // return the user profile
        res.status(200).send(profile);
    }
    catch (error) {
        res.status(404).send({ error, message: 'Profile not found' });
    }
});
exports.getUserProfile = getUserProfile;
// todo - do this later if time
const editUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //get user id and body
    const { _id } = res.locals.user;
    const { bio } = req.body;
    // find one and update
    try {
        const result = yield user_model_1.default.findOneAndUpdate({ _id: _id }, { bio: bio }, { new: true });
        return res.status(200).send(result);
    }
    catch (error) {
        // console.error('my error', error);
        return res.status(400).send({ error, message: 'Profile not found' });
    }
});
exports.editUserProfile = editUserProfile;
