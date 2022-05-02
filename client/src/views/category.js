import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getCategoryRecipes } from '../services/recipeAPI';
import RecipePreview from '../components/non-auth/recipe-preview';

import './styles/category.scss';

const Category = () => {
  const { state } = useLocation();
  const [categoryRecipes, setCategoryRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    //get the category
    const { category } = state;

    getCategoryRecipes(category)
      .then(res => {
        if (res.fetched) {
          setCategoryRecipes(res.data);
          setFilteredRecipes(res.data);
        } else {
          console.log(res.error);
        }
      })
      .catch(error => console.log('Failed to get recipes: ', error));
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value;

    //if search box clear
    if (searchTerm === '') {
      setFilteredRecipes(categoryRecipes);
      return;
    }

    const results = categoryRecipes.filter(recipe => {
      if (recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.creatorHandle.toLowerCase().includes(searchTerm) ||
        recipe.originalSynth.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.tags.includes(searchTerm)
      ) {
        return true;
      }
      return false;
    });

    setFilteredRecipes(results);
  };

  return (
    <div className="category-wrapper">
      <h2 className="title">{state.category}</h2>
      <input className='search-input' type="text" onKeyUp={handleSearch} placeholder="search" />

      <>
        {filteredRecipes.length > 0 ?
          filteredRecipes.map((recipe, i) => (
            <RecipePreview key={`${recipe._id}-${i}`} recipe={recipe} category={recipe.category} />
          ))
          :
          <h3 className="no-content">No matching recipes at current.</h3>
        }
      </>
    </div>
  );
};

export default Category;