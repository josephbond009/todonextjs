'use client'

import React from 'react'
import TodoList from '../components/TodoList'
import ProtectedRoute from '../components/ProtectedRoute'

export default function Page() {
  const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    document.documentElement.setAttribute('data-theme', currentTheme)
  }, [currentTheme])

  const toggleTheme = () => setCurrentTheme((p) => (p === 'light' ? 'dark' : 'light'))

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <ProtectedRoute>
      <TodoList toggleTheme={toggleTheme} currentTheme={currentTheme} />
    </ProtectedRoute>
  )
}


