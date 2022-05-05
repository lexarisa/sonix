// import models
import Recipe from '../models/recipe.model';
import User from '../models/user.model';
import categories from '../models/category.model';
import { Request, Response } from 'express';
import { RecipeResultsType, RecipeType } from '../types/user.types';

// search all recipes
const searchAllRecipes = async (req: Request, res: Response) => {
  // get the search term
  const { searchTerm } = req.params;
  const regex = new RegExp(searchTerm, 'i');

  //todo - search on term - for now returns all recipes
  try {
    const results = await Recipe.find({
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
  } catch (error) {
    res.status(500).send({ error, message: 'Failed to search recipes' });
  }
};

// get a users recipes
const getUserRecipes = async (req: Request, res: Response) => {
  const { own, liked } = req.body;
  try {
    //get own recipes
    const ownRecipes = await Recipe.find({
      _id: { $in: own },
    }).select(
      '_id creatorHandle title numberOfLikes description category originalSynth preview'
    );
    //get liked recipes
    const likedRecipes = await Recipe.find({
      _id: { $in: liked },
    }).select(
      '_id creatorHandle title numberOfLikes description category originalSynth preview'
    );

    res.status(200).json({ ownRecipes, likedRecipes });
  } catch (error) {
    res.status(500).send({ error, message: 'Failed to get user recipes' });
  }
};

// get recipes for dashboard
const getDashBoardRecipes = async (req: Request, res: Response) => {
  //create an object ot store the results

  try {
    let results: RecipeResultsType = {
      Popular: [],
    };
    // get popular recipes - sort by rating
    results.Popular = await Recipe.find({})
      .sort({ numberOfLikes: -1 })
      .limit(10)
      .select(
        '_id creatorHandle title numberOfLikes description category originalSynth preview'
      );

    // get category recipes
    for (const cat of categories) {
      results[cat] = await Recipe.find({ category: cat })
        .sort({ numberOfLikes: -1 })
        .limit(10)
        .select(
          '_id creatorHandle title numberOfLikes description category originalSynth preview'
        );
    }

    // return the result to the user
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error, message: 'Failed to get recipes' });
  }
};

// get recipes by category
const getCategoryRecipes = async (req: Request, res: Response) => {
  //get the category name
  const { categoryName } = req.params;

  try {
    // check if asking for popular
    if (categoryName === 'Popular') {
      try {
        //get top 50 recipes
        const results = await Recipe.find({})
          .sort({ numberOfLikes: -1 })
          .limit(50)
          .select(
            '_id creatorHandle title numberOfLikes description category originalSynth preview tags'
          );

        return res.status(200).send(results);
      } catch (error) {
        return res
          .status(500)
          .send({ error, message: 'Could not fetch popular recipes!' });
      }
    }

    //if asking for anything else check the category exists
    if (!categories.includes(categoryName)) throw new Error('1'); //!Error could be located here since only pop in dashboard
    //get category recipes - ordered by rating
    const results = await Recipe.find({ category: categoryName })
      .sort({ numberOfLikes: -1 })
      .limit(50)
      .select(
        '_id creatorHandle title numberOfLikes description category originalSynth preview tags'
      );
    res.status(200).send(results);
  } catch (error) {
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
};

// get a single recipe
const getRecipe = async (req: Request, res: Response) => {
  // get the recipe id from the req params
  const { id } = req.params;

  try {
    //check the recipe exists
    const recipe = await Recipe.findById(id);
    if (!recipe) throw new Error('1');

    res.status(200).send(recipe);
  } catch (error) {
    switch (`${error}`) {
      case 'Error: 1':
        res.status(404).send({ message: 'Invalid recipe ID!' });
        break;
      default:
        res.status(500).send({ error, message: 'Could not fetch recipe' });
    }
  }
};

// create a new recipe
const createRecipe = async (req: Request, res: Response) => {
  // get the recipe from the request body, creator details from req.user

  const user = res.locals.user;
  const recipe = req.body;
  recipe.creatorId = user._id;
  recipe.creatorHandle = user.handle;
  try {
    // save the new recipe

    const result = await Recipe.create(recipe);

    // .select('_id creatorHandle title numberOfLikes description rating category originalSynth preview');
    if (!result) {
      throw new Error('Could not add recipe to database');
    }

    // todo - need to get required values out of result - do this better!!!
    const {
      _id,
      creatorHandle,
      title,
      numberOfLikes,
      description,
      category,
      originalSynth,
      preview,
    } = result;

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
    const recipeCreator = await User.findById(recipe.creatorId);
    if (!recipeCreator) throw Error('could not find user to store');
    recipeCreator.ownRecipes.push(result._id);
    await recipeCreator.save();

    res.status(201).send(returnRecipe);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error, message: 'Failed to create recipe!' });
  }
};

// like a recipe
const likeRecipe = async (req: Request, res: Response) => {
  // get user and recipe ids
  const userId = res.locals.user._id;
  const { recipeId } = req.params;
  // adjust the number of likes
  try {
    // check the user and recipe exists
    const recipeToUpdate = await Recipe.findById(recipeId);
    const userToUpdate = await User.findById(userId);
    if (!recipeToUpdate || !userToUpdate) throw new Error('1');

    // check use has not already liked this recipe
    if (userToUpdate.likedRecipes.includes(recipeId)) throw new Error('2');

    // add the recipe to the users likedRecipes
    userToUpdate.likedRecipes.push(recipeId);
    await userToUpdate.save();

    // increment number of likes and add user to recipe likedBy
    recipeToUpdate.numberOfLikes++;
    recipeToUpdate.likedBy.push(userId);
    const result = await recipeToUpdate.save();

    res.status(200).send(result);
  } catch (error) {
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
};

// unlike a recipe
const unLikeRecipe = async (req: Request, res: Response) => {
  // get user and recipe ids
  const userId = res.locals.user._id;
  const { recipeId } = req.params;

  // adjust the number of likes
  try {
    // check the user and recipe exists
    const recipeToUpdate = await Recipe.findById(recipeId);
    const userToUpdate = await User.findById(userId);
    if (!recipeToUpdate || !userToUpdate) throw new Error('1');

    // check use has already liked this recipe
    if (!userToUpdate.likedRecipes.includes(recipeId)) throw new Error('2');

    // remove the recipe from the users likedRecipes
    userToUpdate.likedRecipes = userToUpdate.likedRecipes.filter(
      (id: string) => id !== recipeId
    );
    await userToUpdate.save();

    // decrement number of likes and add user to recipe likedBy
    recipeToUpdate.numberOfLikes--;
    recipeToUpdate.likedBy = recipeToUpdate.likedBy.filter(
      (id: string) => id !== userId
    );
    const result = await recipeToUpdate.save();

    res.status(200).send(result);
  } catch (error) {
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
};

//! delete a recipe
const deleteRecipe = async (req: Request, res: Response) => {
  //todo - get the userId from the auth middleware
  // get the recipe id and user id from the req body
  const { recipeId, userId } = req.body;

  try {
    // check the recipe exists and the user id matches recipe creator id
    const recipeToDelete = await Recipe.findById(recipeId);
    // if (!recipeToDelete) throw new Error(1);

    //check the recipe creatorId is the same as userId
    // if (recipeToDelete.creatorId !== userId) throw new Error(2);

    // delete the recipe from the user ownRecipes array
    const recipeCreator = await User.findById(userId);
    recipeCreator.ownRecipes = recipeCreator.ownRecipes.filter(
      (recipe: RecipeType) => recipe.toString() !== recipeId
    );
    await recipeCreator.save();

    // delete the recipe from all users in the recipe likedBy array
    for (const userId of recipeToDelete.likedBy) {
      const user = await User.findById(userId);
      user.likedRecipes = user.likedRecipes.filter(
        (recipe: RecipeType) => recipe !== recipeId
      );
      await user.save();
    }

    //delete the recipe from the recipes collection
    const result = await Recipe.findByIdAndDelete(recipeId);
    res.status(200).send({ deletedRecipe: result, message: 'Recipe deleted!' });
  } catch (error) {
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
};

export {
  searchAllRecipes,
  getDashBoardRecipes,
  getCategoryRecipes,
  getRecipe,
  createRecipe,
  likeRecipe,
  unLikeRecipe,
  deleteRecipe,
  getUserRecipes,
};
