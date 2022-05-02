import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getCategoryRecipes } from '../services/recipeAPI';
import RecipePreview from '../components/non-auth/recipe-preview';
import { CategoryInterface } from '../interfaces/CategoryInterface';
import './styles/category.scss';

const Category = () => {
  const state = useLocation().state as { category: string };
  const [categoryRecipes, setCategoryRecipes] = useState<
    CategoryInterface[] | []
  >();
  const [filteredRecipes, setFilteredRecipes] = useState<
    CategoryInterface[] | []
  >();

  useEffect(() => {
    window.scrollTo(0, 0);
    //get the category
    const category = state.category;

    getCategoryRecipes(category)
      .then((res) => {
        setCategoryRecipes(res);
        setFilteredRecipes(res);
      })
      .catch((error) =>
        console.error('Failed to fetch category recipes: ', error)
      );
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const searchTerm = e.currentTarget.value;

    //if search box clear
    if (searchTerm === '') {
      setFilteredRecipes(categoryRecipes);
      return;
    }
    if (categoryRecipes !== undefined) {
      const results = categoryRecipes.filter((recipe) => {
        if (
          recipe.title.toLowerCase().includes(searchTerm) ||
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
    }
  };

  return (
    <div className="category-wrapper">
      <h2 className="title">{state.category}</h2>
      <input
        className="search-input"
        type="text"
        onKeyUp={handleSearch}
        placeholder="search"
      />

      <>
        {filteredRecipes !== undefined && filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe, i) => (
            <RecipePreview key={`${recipe._id}-${i}`} recipe={recipe} />
          ))
        ) : (
          <h3 className="no-content">No matching recipes at current.</h3>
        )}
      </>
    </div>
  );
};

export default Category;
