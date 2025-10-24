# Todo Application

A modern, responsive Todo application built with React that allows users to manage their tasks efficiently. The application fetches todo data from JSONPlaceholder API and provides a clean, user-friendly interface for viewing and managing todos.

## Features

- 📱 Responsive design that works on all devices
- 🔄 Real-time data fetching with React Query
- 🎨 Modern UI with Ant Design components
- 📋 View list of all todos
- 🔍 Detailed view for individual todos
- ⚡ Fast and efficient data loading
- ♿ Accessibility features included
- 🎯 Error handling and loading states

## Technology Stack

- **Frontend Framework**: React
- **State Management**: React Query (TanStack Query)
- **UI Components**: Ant Design
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Styling**: CSS Modules

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd todo-exam
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

## Project Structure

```
todo-exam/
├── src/
│   ├── components/
│   │   ├── TodoDetails.jsx
│   │   ├── NotFound.jsx
│   │   └── styles/
│   │       └── todoList.css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
└── package.json
```

## API Integration

The application uses the JSONPlaceholder API for todo data:

- Base URL: `https://jsonplaceholder.typicode.com`
- Endpoints:
  - `GET /todos` - Fetch all todos
  - `GET /todos/:id` - Fetch a specific todo

## Features in Detail

### Todo List View
- Displays all todos in a clean, organized list
- Shows completion status for each todo
- Responsive grid layout

### Todo Details View
- Detailed view of individual todos
- Shows todo title, ID, user ID, and completion status
- Error handling for non-existent todos
- Loading states for better UX

## Accessibility Features

- ARIA labels for better screen reader support
- Semantic HTML structure
- Keyboard navigation support
- Loading and error states with appropriate ARIA roles

## Screenshots

### Homepage(darkmode default)
![Homepage(darkmode default)](images/FireShot%20Capture%20007%20-%20Vite%20+%20React%20-%20[localhost].png)

### Homepage(lightmode)
![Homepage(lightmode)](images/FireShot%20Capture%20015%20-%20Vite%20+%20React%20-%20[localhost].png)

### Search input
![Search input](images/FireShot%20Capture%20009%20-%20Vite%20+%20React%20-%20[localhost].png)

### Add new todo
![Add new todo](images/FireShot%20Capture%20011%20-%20Vite%20+%20React%20-%20[localhost].png)
![Add new todo](images/FireShot%20Capture%20012%20-%20Vite%20+%20React%20-%20[localhost].png)

### Filter feature
![Filter feature](images/FireShot%20Capture%20013%20-%20Vite%20+%20React%20-%20[localhost].png)

### Mobile version(darkmode)
![Mobile version(darkmode)](images/FireShot%20Capture%20017%20-%20Vite%20+%20React%20-%20[localhost].png)

### Mobile version(lightmode)
![Mobile version(lightmode)](images/FireShot%20Capture%20018%20-%20Vite%20+%20React%20-%20[localhost].png)

## Known Limitations

- The application uses JSONPlaceholder API, which is a mock API
- No persistent storage (data resets on page refresh)
- No user authentication
- No ability to create, update, or delete todos (API limitations)

## Future Improvements

- [ ] Add user authentication
- [ ] Implement create, update, and delete functionality
- [ ] Add local storage for offline support
- [ ] Implement unit and integration tests

## Acknowledgments

- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for providing the mock API
- [Ant Design](https://ant.design/) for the UI components
- [React Query](https://tanstack.com/query/latest) for data fetching and caching
