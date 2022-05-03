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
exports.getUserRecipes = exports.deleteRecipe = exports.unLikeRecipe = exports.likeRecipe = exports.createRecipe = exports.getRecipe = exports.getCategoryRecipes = exports.getDashBoardRecipes = exports.searchAllRecipes = void 0;
// import models
const recipe_model_1 = __importDefault(require("../models/recipe.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
// search all recipes
const searchAllRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the search term
    const { searchTerm } = req.params;
    const regex = new RegExp(searchTerm, 'i');
    //todo - search on term - for now returns all recipes
    try {
        const results = yield recipe_model_1.default.find({
            $or: [
                { title: { $regex: regex } },
                { creatorHandle: { $regex: regex } },
                { originalSynth: { $regex: regex } },
                { description: { $regex: regex } },
                { category: { $regex: regex } },
                { tags: { $regex: regex } },
            ],
        });
        res.status(200).send(results);
    }
    catch (error) {
        res.status(500).send({ error, message: 'Failed to search recipes' });
    }
});
exports.searchAllRecipes = searchAllRecipes;
// get a users recipes
const getUserRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { own, liked } = req.body;
    try {
        //get own recipes
        const ownRecipes = yield recipe_model_1.default.find({
            _id: { $in: own },
        }).select('_id creatorHandle title numberOfLikes description category originalSynth preview');
        //get liked recipes
        const likedRecipes = yield recipe_model_1.default.find({
            _id: { $in: liked },
        }).select('_id creatorHandle title numberOfLikes description category originalSynth preview');
        res.status(200).json({ ownRecipes, likedRecipes });
    }
    catch (error) {
        res.status(500).send({ error, message: 'Failed to get user recipes' });
    }
});
exports.getUserRecipes = getUserRecipes;
// get recipes for dashboard
const getDashBoardRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //create an object ot store the results
    try {
        let results = {
            Popular: [],
        };
        // get popular recipes - sort by rating
        results.Popular = yield recipe_model_1.default.find({})
            .sort({ numberOfLikes: -1 })
            .limit(10)
            .select('_id creatorHandle title numberOfLikes description category originalSynth preview');
        // get category recipes
        category_model_1.default.forEach((cat) => __awaiter(void 0, void 0, void 0, function* () {
            results[cat] = yield recipe_model_1.default.find({ category: cat })
                .sort({ numberOfLikes: -1 })
                .limit(10)
                .select('_id creatorHandle title numberOfLikes description category originalSynth preview');
        }));
        // return the result to the user
        res.status(200).send(results);
    }
    catch (error) {
        res.status(500).send({ error, message: 'Failed to get recipes' });
    }
});
exports.getDashBoardRecipes = getDashBoardRecipes;
// get recipes by category
const getCategoryRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //get the category name
    const { categoryName } = req.params;
    try {
        // check if asking for popular
        if (categoryName === 'Popular') {
            try {
                //get top 50 recipes
                const results = yield recipe_model_1.default.find({})
                    .sort({ numberOfLikes: -1 })
                    .limit(50)
                    .select('_id creatorHandle title numberOfLikes description category originalSynth preview tags');
                return res.status(200).send(results);
            }
            catch (error) {
                return res
                    .status(500)
                    .send({ error, message: 'Could not fetch popular recipes!' });
            }
        }
        //if asking for anything else check the category exists
        if (!category_model_1.default.includes(categoryName))
            throw new Error('1');
        //get category recipes - ordered by rating
        const results = yield recipe_model_1.default.find({ category: categoryName })
            .sort({ numberOfLikes: -1 })
            .limit(50)
            .select('_id creatorHandle title numberOfLikes description category originalSynth preview tags');
        res.status(200).send(results);
    }
    catch (error) {
        switch (`${error}`) {
            case 'Error: 1':
                res.status(404).send({ message: 'Invalid category selected!' });
                break;
            default:
                res
                    .status(500)
                    .send({ error, message: 'Could not fetch category recipes' });
        }
    }
});
exports.getCategoryRecipes = getCategoryRecipes;
// get a single recipe
const getRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the recipe id from the req params
    const { id } = req.params;
    try {
        //check the recipe exists
        const recipe = yield recipe_model_1.default.findById(id);
        if (!recipe)
            throw new Error('1');
        res.status(200).send(recipe);
    }
    catch (error) {
        switch (`${error}`) {
            case 'Error: 1':
                res.status(404).send({ message: 'Invalid recipe ID!' });
                break;
            default:
                res.status(500).send({ error, message: 'Could not fetch recipe' });
        }
    }
});
exports.getRecipe = getRecipe;
// create a new recipe
const createRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get the recipe from the request body, creator details from req.user
    const user = res.locals.user;
    const recipe = req.body;
    recipe.creatorId = user._id;
    recipe.creatorHandle = user.handle;
    try {
        // save the new recipe
        const result = yield recipe_model_1.default.create(recipe);
        // .select('_id creatorHandle title numberOfLikes description rating category originalSynth preview');
        if (!result) {
            throw new Error('Could not add recipe to database');
        }
        // todo - need to get required values out of result - do this better!!!
        const { _id, creatorHandle, title, numberOfLikes, description, category, originalSynth, preview, } = result;
        const returnRecipe = {
            _id,
            creatorHandle,
            title,
            numberOfLikes,
            description,
            category,
            originalSynth,
            preview,
        };
        // add the recipe to the user profile
        const recipeCreator = yield user_model_1.default.findById(recipe.creatorId);
        if (!recipeCreator)
            throw Error('could not find user to store');
        recipeCreator.ownRecipes.push(result._id);
        yield recipeCreator.save();
        res.status(201).send(returnRecipe);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error, message: 'Failed to create recipe!' });
    }
});
exports.createRecipe = createRecipe;
// like a recipe
const likeRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get user and recipe ids
    const userId = res.locals.user._id;
    const { recipeId } = req.params;
    // adjust the number of likes
    try {
        // check the user and recipe exists
        const recipeToUpdate = yield recipe_model_1.default.findById(recipeId);
        const userToUpdate = yield user_model_1.default.findById(userId);
        if (!recipeToUpdate || !userToUpdate)
            throw new Error('1');
        // check use has not already liked this recipe
        if (userToUpdate.likedRecipes.includes(recipeId))
            throw new Error('2');
        // add the recipe to the users likedRecipes
        userToUpdate.likedRecipes.push(recipeId);
        yield userToUpdate.save();
        // increment number of likes and add user to recipe likedBy
        recipeToUpdate.numberOfLikes++;
        recipeToUpdate.likedBy.push(userId);
        const result = yield recipeToUpdate.save();
        res.status(200).send(result);
    }
    catch (error) {
        switch (`${error}`) {
            case 'Error: 1':
                res.status(404).send({ message: 'Recipe or user not found!' });
                break;
            case 'Error: 2':
                res.status(400).send({ message: 'User already liked this recipe!' });
                break;
            default:
                res.status(500).send({ error, message: 'Failed to like recipe' });
        }
    }
});
exports.likeRecipe = likeRecipe;
// unlike a recipe
const unLikeRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get user and recipe ids
    const userId = res.locals.user._id;
    const { recipeId } = req.params;
    console.log('user: ', userId, 'recipeId: ', recipeId);
    // adjust the number of likes
    try {
        // check the user and recipe exists
        const recipeToUpdate = yield recipe_model_1.default.findById(recipeId);
        const userToUpdate = yield user_model_1.default.findById(userId);
        if (!recipeToUpdate || !userToUpdate)
            throw new Error('1');
        // check use has already liked this recipe
        if (!userToUpdate.likedRecipes.includes(recipeId))
            throw new Error('2');
        // remove the recipe from the users likedRecipes
        userToUpdate.likedRecipes = userToUpdate.likedRecipes.filter((id) => id !== recipeId);
        yield userToUpdate.save();
        // decrement number of likes and add user to recipe likedBy
        recipeToUpdate.numberOfLikes--;
        recipeToUpdate.likedBy = recipeToUpdate.likedBy.filter((id) => id !== userId);
        const result = yield recipeToUpdate.save();
        res.status(200).send(result);
    }
    catch (error) {
        switch (`${error}`) {
            case 'Error: 1':
                res.status(404).send({ message: 'Recipe or user not found!' });
                break;
            case 'Error: 2':
                res.status(400).send({ message: 'User already unliked this recipe!' });
                break;
            default:
                res.status(500).send({ error, message: 'Failed to unlike recipe' });
        }
    }
});
exports.unLikeRecipe = unLikeRecipe;
//! delete a recipe
const deleteRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //todo - get the userId from the auth middleware
    // get the recipe id and user id from the req body
    const { recipeId, userId } = req.body;
    try {
        // check the recipe exists and the user id matches recipe creator id
        const recipeToDelete = yield recipe_model_1.default.findById(recipeId);
        // if (!recipeToDelete) throw new Error(1);
        //check the recipe creatorId is the same as userId
        // if (recipeToDelete.creatorId !== userId) throw new Error(2);
        // delete the recipe from the user ownRecipes array
        const recipeCreator = yield user_model_1.default.findById(userId);
        recipeCreator.ownRecipes = recipeCreator.ownRecipes.filter((recipe) => recipe.toString() !== recipeId);
        yield recipeCreator.save();
        // delete the recipe from all users in the recipe likedBy array
        for (const userId of recipeToDelete.likedBy) {
            const user = yield user_model_1.default.findById(userId);
            user.likedRecipes = user.likedRecipes.filter((recipe) => recipe !== recipeId);
            yield user.save();
        }
        //delete the recipe from the recipes collection
        const result = yield recipe_model_1.default.findByIdAndDelete(recipeId);
        res.status(200).send({ deletedRecipe: result, message: 'Recipe deleted!' });
    }
    catch (error) {
        switch (`${error}`) {
            case 'Error: 1':
                res.status(404).send({ message: 'Recipe does not exist!' });
                break;
            case 'Error: 2':
                res.status(400).send({ message: 'Recipe is not owned by user!' });
                break;
            default:
                res.status(500).send({ error, message: 'Failed to delete recipe' });
        }
    }
});
exports.deleteRecipe = deleteRecipe;
