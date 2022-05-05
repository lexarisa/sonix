import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../state/store';
import RecipePreview from '../components/non-auth/recipe-preview';

const customRender = (component) =>
  render(
    <Provider store={store}>
      <RecipePreview />
    </Provider>
  );
