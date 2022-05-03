"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import mongoose
const connection_1 = require("./connection");
//define the schema
const UserSchema = new connection_1.mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    handle: {
        type: String,
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        required: false,
        default: '',
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    ownRecipes: Array,
    likedRecipes: Array,
}, {
    timestamps: { createdAt: 'joined' },
});
//create the model
const User = connection_1.mongoose.model('User', UserSchema);
//export the model
exports.default = User;
