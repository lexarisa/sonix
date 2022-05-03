"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//imports
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const validate_user_1 = __importDefault(require("./middlewares/validate-user"));
//import the controller methods
const user_controller_1 = require("./controllers/user.controller");
const recipe_controller_1 = require("./controllers/recipe.controller");
//! unauthenticated routes
// recipes
router.get('/searchAll/:searchTerm', recipe_controller_1.searchAllRecipes);
router.get('/dashboard', recipe_controller_1.getDashBoardRecipes);
router.get('/category/:categoryName', recipe_controller_1.getCategoryRecipes);
router.get('/recipe/:id', recipe_controller_1.getRecipe);
router.post('/recipe/user', recipe_controller_1.getUserRecipes);
// users
router.get('/user/:userHandle', user_controller_1.getUserProfile);
router.post('/register', user_controller_1.createUser);
router.post('/login', user_controller_1.loginUser);
//! authenticated routes
// recipes
router.get('/profile/myProfile', validate_user_1.default, user_controller_1.getMyProfile);
router.post('/recipe/create', validate_user_1.default, recipe_controller_1.createRecipe);
router.patch('/recipe/like/:recipeId', validate_user_1.default, recipe_controller_1.likeRecipe);
router.patch('/recipe/unlike/:recipeId', validate_user_1.default, recipe_controller_1.unLikeRecipe);
router.delete('/recipe/delete', validate_user_1.default, recipe_controller_1.deleteRecipe);
// users
router.patch('/profile/edit', validate_user_1.default, user_controller_1.editUserProfile);
//export the router
exports.default = router;
