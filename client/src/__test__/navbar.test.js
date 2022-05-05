import { render, screen } from '@testing-library/react';
import NavBar from '../components/auth/navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../state/store';

const MockComponent = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<NavBar />} />
        </Routes>
      </Router>
    </Provider>
  );
};

test('should render the logo', () => {
  render(<MockComponent />);
  const headingElement = screen.getByText(/sonix/i);
  expect(headingElement).toBeInTheDocument();
});
