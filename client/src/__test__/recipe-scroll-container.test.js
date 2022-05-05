import { render, screen } from '@testing-library/react';
import RecipeScrollContainer from '../components/non-auth/recipe-scroll-container';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const MockComponent = ({ title }) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeScrollContainer title={title} />} />
      </Routes>
    </Router>
  );
};

test('should render the correct heading for each category', () => {
  render(<MockComponent title="My Heading" />);
  const headingElement = screen.getByText(/my heading/i);
  expect(headingElement).toBeInTheDocument();
});
