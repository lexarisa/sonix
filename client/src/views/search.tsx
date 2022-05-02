import React, { useState } from 'react';
import RecipePreview from '../components/non-auth/recipe-preview';
import { searchAllRecipes } from '../services/recipeAPI';

import './styles/search.scss';

// interfaces
import { RecipeInterface } from '../interfaces/RecipeInterface';

const Search: React.FC = () => {
  const [searchRecipes, setSearchRecipes] = useState<RecipeInterface[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const searchTerm = e.currentTarget.value;

    //check the search term is not empty
    if (searchTerm === '') {
      setSearchRecipes([]);
      return;
    }
    //check if already awaiting search request
    if (searching) return;
    //else make a search request to api
    setSearching(true);
    const results = await searchAllRecipes(searchTerm);
    setSearching(false);
    if (results) setSearchRecipes(results);
    else console.log('error');
  };

  return (
    <div className="search-wrapper">
      <h2 className="title">Search</h2>
      <input
        className="search-input"
        type="text"
        onKeyUp={handleSearch}
        placeholder="search"
      />

      <>
        {searchRecipes.length > 0 ? (
          searchRecipes.map((recipe, i) => (
            <RecipePreview
              key={`${recipe._id}-${i}`}
              recipe={recipe}
              // category={recipe.category}
            />
          ))
        ) : (
          <h3 className="no-content">No matching recipes at current.</h3>
        )}
      </>
    </div>
  );
};

export default Search;
