import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Home from '../../pages/Home';

const mockStore = configureStore([]);

describe('Home Component', () => {
  let store;

  describe('When user is not logged in', () => {
    beforeEach(() => {
      store = mockStore({
        authReducer: {
          isLoggedIn: false,
          user: null,
        },
      });
    });

    it('renders the welcome message and signup call to action', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByText("Let's get organized! Welcome to Task Manager.")).toBeInTheDocument();
      expect(screen.getByText('Join now to manage your tasks')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Join now to manage your tasks/i })).toHaveAttribute('href', '/signup');
    });
  });

  describe('When user is logged in', () => {
    beforeEach(() => {
      store = mockStore({
        authReducer: {
          isLoggedIn: true,
          user: { name: 'Test User' },
        },
      });
    });

    it('renders the welcome message and Tasks component', () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByText('Welcome Test User')).toBeInTheDocument();
      expect(screen.getByText('Welcome Test User')).toBeVisible();
    });
  });
});