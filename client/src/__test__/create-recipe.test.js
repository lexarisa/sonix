import CreateRecipe from '../views/create-recipe';
import { screen } from '@testing-library/react';

it('should render the form to create new recipe', () => {
  const createRecipeForm = screen.getAllByTitle('create-form');
  expect(createRecipeForm).toBeInTheDocument();
});
