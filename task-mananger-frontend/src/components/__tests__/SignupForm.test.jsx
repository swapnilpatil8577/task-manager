import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import SignupForm from '../../components/SignupForm';
import useFetch from '../../hooks/useFetch';

// Mock useFetch to control API responses
jest.mock('../../hooks/useFetch');

// Mock useNavigate directly
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('SignupForm Component', () => {
  beforeEach(() => {
    // Reset useFetch mock before each test
    useFetch.mockReturnValue([() => Promise.resolve({ msg: 'Signup successful' }), { loading: false }]); 
  });

  it('renders signup form correctly', () => {
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome user, please signup here')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account? Login here')).toBeInTheDocument();
  });

  it('handles input changes correctly', () => {
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(nameInput.value).toBe('Test User');
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('displays validation errors', () => {
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton); 

    expect(screen.getByText('Name is required')).toBeVisible();
    expect(screen.getByText('Email is required')).toBeVisible();
    expect(screen.getByText('Password is required')).toBeVisible();
  });

  it('submits signup data on valid form submission', async () => {
    const mockFetchData = jest.fn(() => Promise.resolve({ msg: 'Signup successful' })); 
    useFetch.mockReturnValue([mockFetchData, { loading: false }]);

    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for fetchData to resolve

    expect(mockFetchData).toHaveBeenCalledTimes(1);
    expect(mockFetchData).toHaveBeenCalledWith({
      url: '/auth/signup',
      method: 'post',
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
    });
  });

  it('redirects to login page after successful signup', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    const mockFetchData = jest.fn(() => Promise.resolve({ msg: 'Signup successful' })); 
    useFetch.mockReturnValue([mockFetchData, { loading: false }]);

    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for fetchData to resolve

    expect(mockNavigate).toHaveBeenCalledWith('/login'); 
  });
});