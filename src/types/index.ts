// Todo interface matching the JSONPlaceholder API structure
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

// Props interfaces for components
export interface TodoListProps {
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Form values interfaces
export interface AddTodoFormValues {
  title: string;
  completed: boolean;
}

export interface EditTodoFormValues {
  title: string;
  completed: boolean;
}

// API response types
export interface ApiError {
  message: string;
  response?: {
    status: number;
    statusText: string;
  };
  request?: any;
}

// Filter status type
export type FilterStatus = 'all' | 'completed' | 'pending';
