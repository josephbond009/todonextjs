import React from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import type { Todo } from '../types/index.js';
import './styles/todoList.css';

const TodoDetails: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;
  const BASE_URL: string = `https://jsonplaceholder.typicode.com/todos/${id}`;

  const { data: todo, isLoading, error } = useQuery<Todo>({
    queryKey: ['todo', id],
    queryFn: async (): Promise<Todo> => {
      const response = await axios.get<Todo>(BASE_URL);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <main className="todo-detail-container" role="status" aria-live="polite">
        <div className="todo-detail-wrapper">
          <p className="loading-message">Loading todo details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    let errorMessage: string = 'Failed to load todo details.';
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Todo not found.';
        } else {
          errorMessage = `Error: ${error.response.status} - ${error.response.statusText || 'Server Error'}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. No response received from server.';
      } else {
        errorMessage = error.message;
      }
    } else {
      errorMessage = error.message;
    }

    return (
      <main className="todo-detail-container" role="alert" aria-live="assertive">
        <div className="todo-detail-wrapper">
          <p className="error-message">{errorMessage}</p>
          <Link href="/" className="back-button">Back to Todo List</Link>
        </div>
      </main>
    );
  }

  if (!todo) {
    return (
      <main className="todo-detail-container">
        <div className="todo-detail-wrapper">
          <p className="error-message">No todo found with ID: {id}</p>
          <Link href="/" className="back-button">Back to Todo List</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="todo-detail-container">
      <div className="todo-detail-wrapper">
        <header className="detail-header">
          <h2>Todo Details</h2>
        </header>
        <section className="detail-info">
          <p><strong>Title:</strong> {todo.title}</p>
          <p><strong>ID:</strong> {todo.id}</p>
          <p><strong>User ID:</strong> {todo.userId}</p>
          <p>
            <strong>Status:</strong> {' '}
            <span className={todo.completed ? 'status-completed' : 'status-pending'}>
              {todo.completed ? 'Completed' : 'Pending'}
            </span>
          </p>
        </section>
        <Link href="/" className="back-button" aria-label="Back to todo list">
          Back to Todo List
        </Link>
      </div>
    </main>
  );
};

export default TodoDetails;
