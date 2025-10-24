export const metadata = {
  title: 'Todo App',
  description: 'Next.js migrated Todo app',
};

import React from 'react';
import Providers from './providers';
import { AuthProvider } from '../contexts/AuthContext';

import '../index.css';
import '../components/TodoList.css';
import '../components/styles/layout.css';
import '../app/login/login.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}


