import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginForm from '../../components/LoginForm';
import { postLoginData } from '../../redux/actions/authActions';

// Mock useNavigate directly
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),  
    useNavigate: jest.fn(),
}));

const mockStore = configureStore([]);

jest.mock('../../redux/actions/authActions'); // Mock the actions module

describe('LoginForm Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      authReducer: {
        loading: false,
        isLoggedIn: false,
        error: null,
        user: null,
      },
    });

    // Clear any existing localStorage data
    localStorage.clear();
  });

  it('renders login form correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Welcome user, please login here')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account? Signup here")).toBeInTheDocument();
  });

  it('handles input changes correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('displays validation errors', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton); // Submit without filling any fields

    expect(screen.getByText('Email is required')).toBeVisible();
    expect(screen.getByText('Password is required')).toBeVisible();
  });

  it('submits login data on valid form submission', () => {
    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;

    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(postLoginData).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('redirects to home page after successful login', () => {
    const mockNavigate = jest.fn();
    // Assign the mock function to useNavigate before rendering
    useNavigate.mockReturnValue(mockNavigate); 
  
    store = mockStore({
      authReducer: {
        loading: false,
        isLoggedIn: true, 
        error: null,
        user: { /* Mock user data if needed */ },
      },
    });
  
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm /> 
        </BrowserRouter>
      </Provider>
    );
  
    expect(mockNavigate).toHaveBeenCalledWith('/'); 
  });

  it('redirects to specified URL after successful login', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    store = mockStore({
      authReducer: {
        loading: false,
        isLoggedIn: true,
        error: null,
        user: { /* Mock user data if needed */ },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm redirectUrl="/tasks/add" />
        </BrowserRouter>
      </Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/tasks/add');
  });
});