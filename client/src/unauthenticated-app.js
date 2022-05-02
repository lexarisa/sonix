import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setDashboardRecipes } from './state/actions';
import { useEffect } from 'react';

//! custom functions/data
import { getDashboardRecipes } from './services/recipeAPI';

//! views/components/data
import Layout from './views/non-auth-layout';
import Dashboard from './views/dashboard';
import Recipe from './views/recipe';
import Search from './views/search';
import Category from './views/category';
import Profile from './views/profile';
import Login from './views/login';
import Signup from './views/signup';
import NotFound from './views/not-found';

const UnauthenticatedApp = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    //todo - display error message to the user

    //! get the dashboard recipes
    getDashboardRecipes().then(
      res => {
        if (res.fetched) dispatch(setDashboardRecipes(res.data));
      }
    ).catch((error) => {
      console.log('Error:', error);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="recipe" element={<Recipe />} />
          <Route path="search" element={<Search />} />
          <Route path="category" element={<Category />} />
          <Route path="profile/:userHandle" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default UnauthenticatedApp;