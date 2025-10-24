import React, { useState, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Checkbox, Modal, Form, Input, Button, notification, Dropdown } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FilterOutlined, SunOutlined, MoonOutlined, CheckCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import type { Todo, TodoListProps, AddTodoFormValues, EditTodoFormValues, FilterStatus } from '../types/index.js';
import './TodoList.css';

const TodoList: React.FC<TodoListProps> = ({ toggleTheme, currentTheme }) => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState<boolean>(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successModalTitle, setSuccessModalTitle] = useState<string>('');
  const [successModalMessage, setSuccessModalMessage] = useState<string>('');

  const [addForm] = Form.useForm<AddTodoFormValues>();
  const [editForm] = Form.useForm<EditTodoFormValues>();
  const queryClient = useQueryClient();

  const todosPerPage: number = 10;
  const BASE_URL: string = 'https://jsonplaceholder.typicode.com/todos';

  const displaySuccessModal = (title: string, message: string): void => {
    setSuccessModalTitle(title);
    setSuccessModalMessage(message);
    setShowSuccessModal(true);
  };

  const { data: todosData, isLoading, error } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: async (): Promise<Todo[]> => {
      const response = await axios.get<Todo[]>(BASE_URL);
      return response.data;
    }
  });
  const todos: Todo[] = todosData ?? [];

  const addTodoMutation = useMutation<Todo, Error, AddTodoFormValues>({
    mutationFn: async (values: AddTodoFormValues): Promise<Todo> => {
      const response = await axios.post<Todo>(BASE_URL, {
        title: values.title,
        completed: false,
        userId: 1,
      });
      const maxId = todos.length > 0 ? Math.max(...todos.map((t: Todo) => t.id)) : 200;
      return { ...response.data, id: maxId + 1 };
    },
    onSuccess: (newTodo: Todo, variables: AddTodoFormValues) => {
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] | undefined) => [newTodo, ...(oldTodos || [])]);
      setIsAddModalVisible(false);
      addForm.resetFields();
      displaySuccessModal('Todo Added Successfully!', `"${variables.title}" has been added. (Note: JSONPlaceholder simulates this; data is not persistent)`);
    },
    onError: (err: Error) => {
      notification.error({
        message: 'Add Todo Failed',
        description: err.message || 'Could not add todo.',
        placement: 'topRight',
      });
    }
  });

  const updateTodoMutation = useMutation<Todo, Error, EditTodoFormValues>({
    mutationFn: async (values: EditTodoFormValues): Promise<Todo> => {
      if (!editingTodo) {
        throw new Error('No todo being edited');
      }
      const updatedTodoData: Todo = {
        id: editingTodo.id,
        title: values.title,
        completed: values.completed,
        userId: editingTodo.userId,
      };
      await axios.put(`${BASE_URL}/${editingTodo.id}`, updatedTodoData);
      return updatedTodoData;
    },
    onSuccess: (updatedTodo: Todo) => {
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] | undefined) =>
        (oldTodos || []).map(todo => (todo.id === editingTodo?.id ? updatedTodo : todo))
      );
      setIsEditModalVisible(false);
      setEditingTodo(null);
      displaySuccessModal('Todo Updated Successfully!', `"${updatedTodo.title}" has been updated. (Note: JSONPlaceholder simulates this; data is not persistent)`);
    },
    onError: (err: Error) => {
      notification.error({
        message: 'Update Todo Failed',
        description: err.message || 'Could not update todo.',
        placement: 'topRight',
      });
    }
  });

  const deleteTodoMutation = useMutation<number, Error, number>({
    mutationFn: async (id: number): Promise<number> => {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
    },
    onSuccess: (deletedId: number) => {
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] | undefined) =>
        (oldTodos || []).filter(todo => todo.id !== deletedId)
      );
      setIsDeleteConfirmVisible(false);
      setDeletingTodoId(null);
      displaySuccessModal('Todo Deleted Successfully!', 'The todo has been removed. (Note: JSONPlaceholder simulates this; data is not persistent)');
    },
    onError: (err: Error) => {
      notification.error({
        message: 'Delete Todo Failed',
        description: err.message || 'Could not delete todo.',
        placement: 'topRight',
      });
    }
  });

  const handleAddTodo = (values: AddTodoFormValues): void => {
    addTodoMutation.mutate(values);
  };

  const handleUpdateTodo = (values: EditTodoFormValues): void => {
    if (!editingTodo) return;
    updateTodoMutation.mutate(values);
  };

  const handleConfirmDelete = (): void => {
    if (deletingTodoId !== null) {
      deleteTodoMutation.mutate(deletingTodoId);
    }
  };

  const filteredAndSearchedTodos = useMemo((): Todo[] => {
    let filtered: Todo[] = todos;

    if (filterStatus === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(todo => !todo.completed);
    }

    if (searchTerm) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [todos, filterStatus, searchTerm]);

  const indexOfLastTodo: number = currentPage * todosPerPage;
  const indexOfFirstTodo: number = indexOfLastTodo - todosPerPage;
  const currentTodos: Todo[] = filteredAndSearchedTodos.slice(indexOfFirstTodo, indexOfLastTodo);
  const totalPages: number = Math.ceil(filteredAndSearchedTodos.length / todosPerPage);

  // Reset current page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  const filterMenu = {
    items: [
      { key: 'all', label: 'All' },
      { key: 'completed', label: 'Completed' },
      { key: 'pending', label: 'Pending' },
    ],
    selectable: true,
    onClick: ({ key }: { key: string }) => setFilterStatus(key as FilterStatus),
    selectedKeys: [filterStatus],
  };

  if (isLoading) {
    return (
      <div className="todo-list-container" role="status" aria-live="polite">
        <div className="todo-list-wrapper">
          <div className="loading-state-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading todos, please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="todo-list-container" role="alert" aria-live="assertive">
        <div className="todo-list-wrapper">
          <p className="error-message">Error: {error.message}</p>
          <p className="error-message">Please check your network connection or try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="todo-list-container">
      <div className="todo-list-wrapper">
        <header className="todo-list-header">
          <div className="header-title-section">
            <h2>GetMyTasks</h2>
            {user && (
              <div className="user-info">
                <span>Welcome, {user.name}</span>
                <Button
                  icon={<LogoutOutlined />}
                  onClick={logout}
                  className="logout-button"
                  size="small"
                  type="text"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
          <div className="header-controls">
            <div className="search-row">
              <label htmlFor="search-todo" className="visually-hidden">Search Todos</label>
              <Input
                id="search-todo"
                className="search-input"
                placeholder="Q Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search todos by title"
              />
            </div>
            <div className="buttons-row">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddModalVisible(true)}
                className="add-todo-button"
                aria-label="Add new todo"
              >
                Add New Todo
              </Button>
              <Dropdown menu={filterMenu} trigger={['click']} placement="bottomRight">
                <Button className="filter-dropdown-button" aria-label="Filter todos">
                  <FilterOutlined /> Filter
                </Button>
              </Dropdown>
              <Button
                onClick={toggleTheme}
                className="theme-toggle-button"
                aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
              >
                {currentTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
                <span className="visually-hidden">Switch to {currentTheme === 'light' ? 'dark' : 'light'} mode</span>
              </Button>
            </div>
          </div>
        </header>

        <section className="todo-items-grid" aria-live="polite">
          {currentTodos.length === 0 && !isLoading && !error && todos.length > 0 ? (
            <p className="no-todos-message">No todos found matching your criteria.</p>
          ) : (
            currentTodos.map(todo => (
              <div key={todo.id} className="todo-item-card">
                <div className="todo-item-card-content">
                  <Checkbox checked={todo.completed} disabled aria-label={`Todo ${todo.title} is ${todo.completed ? 'completed' : 'not completed'}`} />
                  <span className={`todo-item-title ${todo.completed ? 'completed-text' : ''}`}>
                    {todo.title}
                  </span>
                </div>
                <div className="todo-card-footer">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => { setEditingTodo(todo); editForm.setFieldsValue({ title: todo.title, completed: todo.completed }); setIsEditModalVisible(true); }}
                    className="action-button edit-button"
                    aria-label={`Edit todo: ${todo.title}`}
                    size="small"
                  >
                    Edit
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => { setDeletingTodoId(todo.id); setIsDeleteConfirmVisible(true); }}
                    className="action-button delete-button"
                    aria-label={`Delete todo: ${todo.title}`}
                    size="small"
                  >
                    Delete
                  </Button>
                  <Link href={`/todos/${todo.id}`} className="action-button view-button" aria-label={`View details for todo: ${todo.title}`}>
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
        </section>

        <nav className="pagination-controls" aria-label="Pagination Navigation">
          <button
            className="pagination-button"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
              aria-label={`Go to page ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="pagination-button"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Go to next page"
          >
            Next
          </button>
        </nav>
      </div>

      <Modal
        title="Add New Todo"
        open={isAddModalVisible}
        onCancel={() => { setIsAddModalVisible(false); addForm.resetFields(); }}
        footer={null}
      >
        <Form form={addForm} onFinish={handleAddTodo} layout="vertical" initialValues={{ completed: false }}>
          <Form.Item
            name="title"
            label="Todo Title"
            rules={[{ required: true, message: 'Please input the todo title!' }]}
          >
            <Input placeholder="e.g., Plan social media content" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="add-todo-modal-button">
              Add Todo
            </Button>
            <Button onClick={() => { setIsAddModalVisible(false); addForm.resetFields(); }} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Todo"
        open={isEditModalVisible}
        onCancel={() => { setIsEditModalVisible(false); setEditingTodo(null); editForm.resetFields(); }}
        footer={null}
      >
        <Form form={editForm} onFinish={handleUpdateTodo} layout="vertical">
          <Form.Item
            name="title"
            label="Todo Title"
            rules={[{ required: true, message: 'Please input the todo title!' }]}
          >
            <Input placeholder="e.g., Plan social media content" />
          </Form.Item>
          <Form.Item name="completed" valuePropName="checked" >
            <Checkbox>Completed</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Todo
            </Button>
            <Button onClick={() => { setIsEditModalVisible(false); setEditingTodo(null); editForm.resetFields(); }} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={isDeleteConfirmVisible}
        onOk={handleConfirmDelete}
        onCancel={() => { setIsDeleteConfirmVisible(false); setDeletingTodoId(null); }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this todo? This action cannot be undone.</p>
      </Modal>

      <Modal
        open={showSuccessModal}
        title={successModalTitle}
        onCancel={() => setShowSuccessModal(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>,
        ]}
        centered
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <CheckCircleOutlined style={{ fontSize: '48px', color: '#28a745' }} />
        </div>
        <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#333333' }}>
          {successModalMessage}
        </p>
      </Modal>
    </main>
  );
};

export default TodoList;
