import { combineReducers } from 'redux';
import { RecipeInterface } from '../interfaces/RecipeInterface';
import { UserInterface } from '../interfaces/UserInterface';

const authenticated = (loggedIn: boolean = false, action: any) => {
  if (action.type === 'LOGIN') {
    const newLoggedIn = true;
    return newLoggedIn;
  }

  if (action.type === 'LOGOUT') {
    const newLoggedIn = false;
    localStorage.removeItem('accessToken');
    return newLoggedIn;
  }
  return loggedIn;
};

const profile = (userProfile: UserInterface | {} = {}, action: any) => {
  if (action.type === 'SET_USER_PROFILE') {
    const newProfile = action.profile;
    return newProfile;
  }

  //like recipe
  if (action.type === 'LIKE_RECIPE') {
    const newProfile = JSON.parse(JSON.stringify(userProfile));
    newProfile.likedRecipes[action.recipeId] = true;
    return newProfile;
  }

  //unlike recipe
  if (action.type === 'UNLIKE_RECIPE') {
    const newProfile = JSON.parse(JSON.stringify(userProfile));
    delete newProfile.likedRecipes[action.recipeId];
    return newProfile;
  }

  if (action.type === 'STORE_PROFILE_RECIPE') {
    const newProfile = JSON.parse(JSON.stringify(userProfile));
    newProfile['ownRecipes'].push(action.recipeId);
    return newProfile;
  }

  if (action.type === 'UPDATE_MY_BIO') {
    return {
      ...userProfile,
      bio: action.newBio,
    };
  }

  return userProfile;
};

const dashboardRecipes = (recipes = {}, action: any) => {
  if (action.type === 'SET_DASHBOARD_RECIPES') {
    const newDashboardRecipes = action.recipes;
    return newDashboardRecipes;
  }

  if (action.type === 'STORE_RECIPE') {
    const newDashboardRecipes = JSON.parse(JSON.stringify(recipes));
    newDashboardRecipes[action.category]
      ? newDashboardRecipes[action.category].push(action.newRecipe)
      : (newDashboardRecipes[action.category] = [action.newRecipe]);
    return newDashboardRecipes;
  }

  if (action.type === 'LIKE_DASHBOARD_RECIPE') {
    const newDashboardRecipes = JSON.parse(JSON.stringify(recipes));
    //handle category

    newDashboardRecipes[action.category] &&
      newDashboardRecipes[action.category].map((recipe: RecipeInterface) => {
        if (recipe._id === action.recipeId) {
          recipe.numberOfLikes++;
        }
      });
    //check if in popular also
    if (action.category !== 'Popular') {
      newDashboardRecipes['Popular'].map((recipe: RecipeInterface) => {
        if (recipe._id === action.recipeId) {
          recipe.numberOfLikes++;
        }
      });
      newDashboardRecipes['Popular'].sort(
        (a: RecipeInterface, b: RecipeInterface) =>
          b.numberOfLikes - a.numberOfLikes
      );
    }
    newDashboardRecipes[action.category] &&
      newDashboardRecipes[action.category].sort(
        (a: RecipeInterface, b: RecipeInterface) =>
          b.numberOfLikes - a.numberOfLikes
      );
    return newDashboardRecipes;
  }

  if (action.type === 'UNLIKE_DASHBOARD_RECIPE') {
    const newDashboardRecipes = JSON.parse(JSON.stringify(recipes));

    newDashboardRecipes[action.category] &&
      newDashboardRecipes[action.category].map((recipe: RecipeInterface) => {
        if (recipe._id === action.recipeId) {
          recipe.numberOfLikes--;
        }
      });

    if (action.category !== 'Popular') {
      newDashboardRecipes['Popular'].map((recipe: RecipeInterface) => {
        if (recipe._id === action.recipeId) {
          recipe.numberOfLikes--;
        }
      });
      newDashboardRecipes['Popular'].sort(
        (a: RecipeInterface, b: RecipeInterface) =>
          b.numberOfLikes - a.numberOfLikes
      );
    }

    newDashboardRecipes[action.category] &&
      newDashboardRecipes[action.category].sort(
        (a: RecipeInterface, b: RecipeInterface) =>
          b.numberOfLikes - a.numberOfLikes
      );
    return newDashboardRecipes;
  }

  return recipes;
};

// Combining both reducers
const reducers = combineReducers({
  authenticated,
  profile,
  dashboardRecipes,
});

export default reducers;
