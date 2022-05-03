//imports
import express from 'express';
const router = express.Router();
import validateUser from './middlewares/validate-user';

//import the controller methods
import {
  createUser,
  loginUser,
  getUserProfile,
  editUserProfile,
  getMyProfile,
} from './controllers/user.controller';

import {
  searchAllRecipes,
  getDashBoardRecipes,
  getCategoryRecipes,
  getRecipe,
  createRecipe,
  likeRecipe,
  unLikeRecipe,
  deleteRecipe,
  getUserRecipes,
} from './controllers/recipe.controller';

//! unauthenticated routes
// recipes
router.get('/searchAll/:searchTerm', searchAllRecipes);
router.get('/dashboard', getDashBoardRecipes);
router.get('/category/:categoryName', getCategoryRecipes);
router.get('/recipe/:id', getRecipe);
router.post('/recipe/user', getUserRecipes);

// users
router.get('/user/:userHandle', getUserProfile);
router.post('/register', createUser);
router.post('/login', loginUser);

//! authenticated routes
// recipes
router.get('/profile/myProfile', validateUser, getMyProfile);
router.post('/recipe/create', validateUser, createRecipe);
router.patch('/recipe/like/:recipeId', validateUser, likeRecipe);
router.patch('/recipe/unlike/:recipeId', validateUser, unLikeRecipe);
router.delete('/recipe/delete', validateUser, deleteRecipe);

// users
router.patch('/profile/edit', validateUser, editUserProfile);

//export the router
export default router;
