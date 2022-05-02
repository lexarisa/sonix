//! user actions
export const login = () => ({
  type: 'LOGIN',
});

export const logout = () => ({
  type: 'LOGOUT',
});

export const setUserProfile = (profile: string) => ({
  type: 'SET_USER_PROFILE',
  profile,
});

export const updateMyBio = (newBio: string) => ({
  type: 'UPDATE_MY_BIO',
  newBio,
});

//! user recipe actions
export const setLikeRecipe = (recipeId: string) => ({
  type: 'LIKE_RECIPE',
  recipeId,
});

export const setUnlikeRecipe = (recipeId: string) => ({
  type: 'UNLIKE_RECIPE',
  recipeId,
});

export const storeRecipe = (newRecipe, category) => ({
  type: 'STORE_RECIPE',
  newRecipe,
  category,
});

export const storeRecipeProfile = (recipeId: string) => ({
  type: 'STORE_PROFILE_RECIPE',
  recipeId,
});

export const deleteRecipe = (recipeId: string) => ({
  type: 'DELETE_RECIPE',
  recipeId,
});

//! recipe actions
export const setDashboardRecipes = (recipes: string) => ({
  type: 'SET_DASHBOARD_RECIPES',
  recipes,
});

export const likeDashboardRecipes = (recipeId, category) => ({
  type: 'LIKE_DASHBOARD_RECIPE',
  recipeId,
  category,
});

export const unlikeDashboardRecipes = (recipeId, category) => ({
  type: 'UNLIKE_DASHBOARD_RECIPE',
  recipeId,
  category,
});
