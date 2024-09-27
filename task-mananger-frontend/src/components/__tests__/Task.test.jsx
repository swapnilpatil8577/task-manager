import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Task from '../../pages/Task';
import useFetch from '../../hooks/useFetch';

// Mock useFetch, useSelector, and useDispatch
jest.mock('../../hooks/useFetch');
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Mock useNavigate and useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe('Task Component', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    useFetch.mockReturnValue([() => Promise.resolve(), { loading: false }]);
    useSelector.mockReturnValue({ token: 'test-token' });
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
  });

  describe('Add Task Mode', () => {
    beforeEach(() => {
      useParams.mockReturnValue({ taskId: undefined }); // Simulate no taskId for add mode
    });

    it('renders add task form correctly', () => {
      render(
        <BrowserRouter>
          <Task />
        </BrowserRouter>
      );

      expect(screen.getByText('Add New Task')).toBeInTheDocument();
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('validates form fields', async () => {
      render(
        <BrowserRouter>
          <Task />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole('button', { name: 'Add' });
      fireEvent.click(submitButton);

      expect(screen.getByText('Title is required')).toBeVisible();
      expect(screen.getByText('Due Date is required')).toBeVisible();
    });

    it('submits the form with valid data', async () => {
      const mockFetchData = jest.fn(() => Promise.resolve());
      useFetch.mockReturnValue([mockFetchData, { loading: false }]);

      render(
        <BrowserRouter>
          <Task />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Task' } });
      fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
      fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2024-12-12' } });

      const submitButton = screen.getByRole('button', { name: 'Add' });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockFetchData).toHaveBeenCalledTimes(1));
      expect(mockFetchData).toHaveBeenCalledWith({
        url: '/tasks',
        method: 'post',
        data: {
          title: 'Test Task',
          description: 'Test Description',
          dueDate: '2024-12-12',
          status: 'New',
        },
        headers: { Authorization: 'test-token' },
      });

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Edit Task Mode', () => {
    const mockTaskData = {
      _id: 'mock-task-id',
      title: 'Mock Task',
      description: 'This is a mock task description.',
      dueDate: '2024-12-25',
      status: 'Inprogress',
    };
  });
});