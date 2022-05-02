import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import './styles/recipe.scss';
import RecipeDetails from '../components/non-auth/recipe-details';
import Ingredients from '../components/non-auth/ingredients';
import Method from '../components/non-auth/method';

import { getRecipe } from '../services/recipeAPI';

const Recipe = () => {
  const { state } = useLocation();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    //get the recipe details from the server
    getRecipe(state.recipeId).then(res => {
      if (res.fetched) {
        setRecipe(res.data);
      }

      //todo - show error message to user
    }).catch(error => {
      console.error(error);
    });

  }, []);

  return (
    <div className="recipe-wrapper">
      {recipe &&
        <>
          <RecipeDetails recipe={recipe} setRecipe={setRecipe} />
          <div className="recipe-info-container">
            <Ingredients ingredients={recipe.ingredients} />
            <Method steps={recipe.recipeMethod} />
          </div>
        </>
      }
    </div>
  );
};

export default Recipe;