//! user actions
export const login = () => ({
  type: 'LOGIN'
});

export const logout = () => ({
  type: 'LOGOUT'
});

export const setUserProfile = (profile) => ({
  type: 'SET_USER_PROFILE',
  profile
});

export const updateMyBio = (newBio) => ({
  type: 'UPDATE_MY_BIO',
  newBio
});

//! user recipe actions
export const setLikeRecipe = (recipeId) => ({
  type: 'LIKE_RECIPE',
  recipeId
});

export const setUnlikeRecipe = (recipeId) => ({
  type: 'UNLIKE_RECIPE',
  recipeId
});

export const storeRecipe = (newRecipe, category) => ({
  type: 'STORE_RECIPE',
  newRecipe,
  category
});

export const storeRecipeProfile = (recipeId) => ({
  type: 'STORE_PROFILE_RECIPE',
  recipeId
});

export const deleteRecipe = (recipeId) => ({
  type: 'DELETE_RECIPE',
  recipeId
});

//! recipe actions
export const setDashboardRecipes = (recipes) => ({
  type: 'SET_DASHBOARD_RECIPES',
  recipes
});

export const likeDashboardRecipes = (recipeId, category) => ({
  type: 'LIKE_DASHBOARD_RECIPE',
  recipeId,
  category
});

export const unlikeDashboardRecipes = (recipeId, category) => ({
  type: 'UNLIKE_DASHBOARD_RECIPE',
  recipeId,
  category
});




