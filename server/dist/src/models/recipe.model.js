"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import mongoose
const connection_1 = require("./connection");
//define the schema
const RecipeSchema = new connection_1.mongoose.Schema({
    creatorHandle: {
        type: String,
        required: true,
    },
    creatorId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    numberOfLikes: {
        type: Number,
        required: false,
        default: 0,
    },
    likedBy: Array,
    category: {
        type: String,
        enum: ['Bass', 'Pad', 'String', 'Lead', 'Pluck', 'FX', 'Keys', 'Other'],
        required: true,
    },
    originalSynth: {
        type: String,
        required: false,
        default: '',
    },
    preview: {
        type: String,
        required: true,
    },
    tags: Array,
    ingredients: {
        type: Array,
        required: true,
    },
    recipeMethod: {
        type: Array,
        required: true,
    },
}, {
    timestamps: { createdAt: 'created' },
});
//create the model
const Recipe = connection_1.mongoose.model('Recipe', RecipeSchema);
//export the model
exports.default = Recipe;
