import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Navbar from '../../components/Navbar';

const mockStore = configureStore([]);

describe('Navbar Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({ 
      authReducer: {
        isLoggedIn: false, // Set initial authentication state
        user: null,        // Set initial user data (if needed)
      }
    });
  });

  it('renders the logo and navigation links when not logged in', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Task Manager')).toBeInTheDocument(); 

    const loginButton = screen.getAllByText('Login');
    expect(loginButton[0]).toBeInTheDocument();
  });

  it('renders user-specific links when logged in', () => {
    store = mockStore({
      authReducer: {
        isLoggedIn: true,
        user: { name: 'Test User' }, // Set user data
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Task Manager')).toBeInTheDocument();

    const logoutButton = screen.getAllByText('Logout'); 
    expect(logoutButton[0]).toBeInTheDocument();
  });
});