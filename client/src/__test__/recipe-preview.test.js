import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../state/store';
import RecipePreview from '../components/non-auth/recipe-preview';

const MockComponent = ({ recipe }) => {
  return (
    <Provider store={store}>
      <RecipePreview recipe={recipe} />
    </Provider>
  );
};

describe('Recipe Preview', () => {
  it('should change like button once clicked', async () => {
    render(<MockComponent recipe={{}} />);
    const buttonElement = screen.getByRole('button', { name: /like/i });
    fireEvent.click(buttonElement, {}); //second arg is what we what to change by
  });

  it('should be able to play audio', () => {});
});
