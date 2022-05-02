import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setDashboardRecipes } from './state/actions';
import { useEffect } from 'react';

//! custom functions/data
import { getDashboardRecipes } from './services/recipeAPI';
import { getMyProfile } from './services/userAPI';
import { setUserProfile, logout } from './state/actions';

//! views/components/data
import Layout from './views/auth-layout';
import Dashboard from './views/dashboard';
import Recipe from './views/recipe';
import CreateRecipe from './views/create-recipe';
import Search from './views/search';
import Category from './views/category';
import Profile from './views/profile';
import MyProfile from './views/my-profile';
import NotFound from './views/not-found';

const AuthenticatedApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    //! check user token is valid and fetch profile
    getMyProfile()
      .then((res) => {
        if (res) {
          //store my profile in store
          dispatch(setUserProfile(res));
        } else {
          //logout user
          dispatch(logout());
        }
      })
      .catch((error) => console.error('Failed to get user profile: ', error));

    //! get the dashboard recipes

    getDashboardRecipes()
      .then((res) => dispatch(setDashboardRecipes(res)))
      .catch((error) =>
        console.log('Failed to fetch dashboard recipes: ', error.statusText)
      );
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="recipe" element={<Recipe />} />
          <Route path="create" element={<CreateRecipe />} />
          <Route path="search" element={<Search />} />
          <Route path="category" element={<Category />} />
          <Route path="profile/:userHandle" element={<Profile />} />
          <Route path="me" element={<MyProfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AuthenticatedApp;
